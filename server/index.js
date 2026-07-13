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

app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: {
    directives: {
      frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
    },
  },
}));
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
  limits: { fileSize: 5 * 1024 * 1024, files: 7 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const accepted = allowed.includes(file.mimetype);
    callback(accepted ? null : new Error("Only JPG, PNG and WebP images are accepted"), accepted);
  },
});

function serializeProperty(document) {
  const item = document.toObject ? document.toObject() : document;
  const version = new Date(item.updatedAt).getTime();
  const imageUrls = item.images?.length
    ? item.images.map((_image, index) => `/api/properties/${item._id}/images/${index}?v=${version}`)
    : item.image?.contentType ? [`/api/properties/${item._id}/image?v=${version}`] : [];
  return {
    id: item._id.toString(),
    title: item.title,
    category: item.category,
    location: item.location,
    area: item.area,
    property_type: item.property_type,
    price: item.price,
    description: item.description,
    youtube_url: item.youtube_url || "",
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    status: item.status,
    featured: Boolean(item.featured),
    image_url: imageUrls[0] || null,
    image_urls: imageUrls,
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
    youtube_url: String(body.youtube_url || "").trim(),
    bedrooms: body.bedrooms === "" || body.bedrooms == null ? null : Number(body.bedrooms),
    bathrooms: body.bathrooms === "" || body.bathrooms == null ? null : Number(body.bathrooms),
    status: String(body.status || "Available").trim(),
    featured: ["true", "1", "on", true, 1].includes(body.featured),
  };
}

function youtubeVideoId(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";
    if (hostname === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
    if (["youtube.com", "m.youtube.com"].includes(hostname)) {
      id = url.pathname === "/watch"
        ? url.searchParams.get("v") || ""
        : url.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1] || "";
    }
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function validateProperty(values, imageRequired, files = []) {
  const missing = ["title", "category", "location", "area", "property_type", "price"].filter((key) => !values[key]);
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (imageRequired && !files.length) return "Please select between 1 and 7 property images";
  if (files.length > 7) return "A property can have a maximum of 7 images";
  if (files.reduce((total, file) => total + file.size, 0) > 14 * 1024 * 1024) return "The combined image size must be smaller than 14MB";
  if (values.youtube_url && youtubeVideoId(values.youtube_url) === null) return "Enter a valid YouTube video link";
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

app.get("/api/properties/:id/images/:index", validId, async (req, res, next) => {
  try {
    const index = Number(req.params.index);
    if (!Number.isInteger(index) || index < 0 || index > 6) return res.status(400).end();
    const item = await Property.findById(req.params.id).select("+images.data images.contentType updatedAt");
    const image = item?.images?.[index];
    if (!image?.data) return res.status(404).end();
    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(image.data);
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

app.post("/api/admin/properties", requireAdmin, upload.array("images", 7), async (req, res, next) => {
  try {
    const values = propertyValues(req.body);
    const problem = validateProperty(values, true, req.files);
    if (problem) return res.status(400).json({ error: problem });
    const item = await Property.create({
      ...values,
      images: req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype })),
    });
    res.status(201).json(serializeProperty(item));
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/properties/:id", requireAdmin, validId, upload.array("images", 7), async (req, res, next) => {
  try {
    const values = propertyValues(req.body);
    const problem = validateProperty(values, false, req.files);
    if (problem) return res.status(400).json({ error: problem });
    if (req.files.length) values.images = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));
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
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Each image must be smaller than 5MB"
      : error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE"
        ? "A property can have a maximum of 7 images"
        : error.message;
    return res.status(400).json({ error: message });
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
