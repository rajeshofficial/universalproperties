import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import multer from "multer";
import mongoose from "mongoose";
import { createAdminToken, hashPassword, requireAdmin, verifyPassword } from "./auth.js";
import { connectDatabase, databaseReady } from "./db.js";
import { AdminCredential } from "./models/AdminCredential.js";
import { Property } from "./models/Property.js";
import { seedDefaultProperties } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const app = express();
const defaultPort = process.env.NODE_ENV === "production" ? 3000 : 3001;
const port = Number(process.env.PORT || defaultPort);

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-origin" } }));
app.use(express.json({ limit: "1mb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please wait 15 minutes." },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const accepted = allowed.includes(file.mimetype);
    callback(accepted ? null : new Error("Only JPG, PNG and WebP images are accepted"), accepted);
  },
});

function serializeProperty(document) {
  const item = document.toObject ? document.toObject() : document;
  return {
    id: item._id.toString(),
    title: item.title,
    category: item.category,
    location: item.location,
    area: item.area,
    property_type: item.property_type,
    price: item.price,
    description: item.description,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    status: item.status,
    featured: Boolean(item.featured),
    image_url: item.image?.contentType ? `/api/properties/${item._id}/image?v=${new Date(item.updatedAt).getTime()}` : null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

function propertyValues(body) {
  return {
    title: String(body.title || "").trim(),
    category: String(body.category || "").trim(),
    location: String(body.location || "").trim(),
    area: String(body.area || "").trim(),
    property_type: String(body.property_type || body.category || "").trim(),
    price: String(body.price || "").trim(),
    description: String(body.description || "").trim(),
    bedrooms: body.bedrooms === "" || body.bedrooms == null ? null : Number(body.bedrooms),
    bathrooms: body.bathrooms === "" || body.bathrooms == null ? null : Number(body.bathrooms),
    status: String(body.status || "Available").trim(),
    featured: ["true", "1", "on", true, 1].includes(body.featured),
  };
}

function validateProperty(values, imageRequired, file) {
  const missing = ["title", "category", "location", "area", "property_type", "price"].filter((key) => !values[key]);
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (imageRequired && !file) return "A property image is required";
  if (values.bedrooms != null && (!Number.isInteger(values.bedrooms) || values.bedrooms < 0)) return "Bedrooms must be a whole number";
  if (values.bathrooms != null && (!Number.isInteger(values.bathrooms) || values.bathrooms < 0)) return "Bathrooms must be a whole number";
  return null;
}

function validId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid property ID" });
  next();
}

app.get("/api/health", (_req, res) => {
  res.status(databaseReady() ? 200 : 503).json({ status: databaseReady() ? "ok" : "database unavailable" });
});

app.get("/api/properties", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.location) filter.location = req.query.location;
    if (req.query.featured === "true") filter.featured = true;
    if (req.query.status) filter.status = req.query.status;
    const rows = await Property.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json(rows.map(serializeProperty));
  } catch (error) {
    next(error);
  }
});

app.get("/api/properties/:id", validId, async (req, res, next) => {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Property not found" });
    res.json(serializeProperty(item));
  } catch (error) {
    next(error);
  }
});

app.get("/api/properties/:id/image", validId, async (req, res, next) => {
  try {
    const item = await Property.findById(req.params.id).select("+image.data image.contentType updatedAt");
    if (!item?.image?.data) return res.status(404).end();
    res.set("Content-Type", item.image.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(item.image.data);
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", loginLimiter, async (req, res, next) => {
  try {
    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    if (req.body.username !== expectedUser) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }

    let credential = await AdminCredential.findOne({ username: expectedUser }).select("+passwordHash +salt");
    if (!credential) {
      const initialPassword = process.env.ADMIN_PASSWORD;
      if (!initialPassword) return res.status(503).json({ error: "Admin password is not configured" });
      if (req.body.password !== initialPassword) return res.status(401).json({ error: "Incorrect username or password" });
      const hashed = await hashPassword(initialPassword);
      credential = await AdminCredential.create({ username: expectedUser, ...hashed });
    } else if (!(await verifyPassword(req.body.password, credential.salt, credential.passwordHash))) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }

    res.json({ token: createAdminToken(expectedUser), username: expectedUser });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/change-password", requireAdmin, async (req, res, next) => {
  try {
    const currentPassword = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");
    if (newPassword.length < 12) return res.status(400).json({ error: "New password must contain at least 12 characters" });
    if (newPassword === currentPassword) return res.status(400).json({ error: "New password must be different from the current password" });

    const username = req.admin.sub;
    const credential = await AdminCredential.findOne({ username }).select("+passwordHash +salt");
    if (!credential || !(await verifyPassword(currentPassword, credential.salt, credential.passwordHash))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashed = await hashPassword(newPassword);
    credential.passwordHash = hashed.passwordHash;
    credential.salt = hashed.salt;
    credential.passwordChangedAt = new Date();
    await credential.save();
    res.json({ message: "Password changed successfully. Please sign in again." });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/properties", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const values = propertyValues(req.body);
    const problem = validateProperty(values, true, req.file);
    if (problem) return res.status(400).json({ error: problem });
    const item = await Property.create({
      ...values,
      image: { data: req.file.buffer, contentType: req.file.mimetype },
    });
    res.status(201).json(serializeProperty(item));
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/properties/:id", requireAdmin, validId, upload.single("image"), async (req, res, next) => {
  try {
    const values = propertyValues(req.body);
    const problem = validateProperty(values, false, req.file);
    if (problem) return res.status(400).json({ error: problem });
    if (req.file) values.image = { data: req.file.buffer, contentType: req.file.mimetype };
    const item = await Property.findByIdAndUpdate(req.params.id, values, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: "Property not found" });
    res.json(serializeProperty(item));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/properties/:id", requireAdmin, validId, async (req, res, next) => {
  try {
    const item = await Property.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Property not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "dist"), { maxAge: "1h" }));
  app.get("*", (_req, res) => res.sendFile(path.join(rootDir, "dist", "index.html")));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 5MB" : error.message });
  }
  if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
  res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Server error" : error.message });
});

connectDatabase()
  .then(seedDefaultProperties)
  .then(() => app.listen(port, "0.0.0.0", () => console.log(`Universal Group MERN server listening on port ${port}`)))
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
