import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Property } from "./models/Property.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../public/assets");

const defaults = [
  ["Skyline Residency", "Apartment", "Rohini, Delhi", "161 gaz", "₹ 1.85 Cr", "apartment.jpg", true],
  ["Eldeco County Villa", "Villa", "Sonipat, Haryana", "244 gaz", "₹ 2.40 Cr", "villa.jpg", true],
  ["Cyber Heights Tower", "Commercial", "Cyber City, Gurgaon", "344 gaz", "₹ 5.20 Cr", "commercial.jpg", false],
  ["Noida Greens Residency", "Apartment", "Sector 78, Noida", "147 gaz", "₹ 1.65 Cr", "noida.jpg", false],
  ["The Palms Villa", "Villa", "Greater Noida", "311 gaz", "₹ 3.10 Cr", "villa-pool.jpg", true],
  ["Capital Penthouse", "Penthouse", "Central Delhi", "400 gaz", "₹ 7.95 Cr", "penthouse.jpg", false],
];

export async function seedDefaultProperties() {
  try {
    await Property.createCollection();
  } catch (error) {
    if (error.codeName !== "NamespaceExists" && error.code !== 48) throw error;
  }

  await Property.syncIndexes();
  if (await Property.estimatedDocumentCount()) return;

  const documents = await Promise.all(defaults.map(async ([title, category, location, area, price, filename, featured]) => ({
    title, category, location, area, price, featured,
    property_type: category,
    status: "Available",
    description: `Premium ${category.toLowerCase()} available in ${location}. Contact Universal Group for complete details and a site visit.`,
    image: {
      data: await fs.readFile(path.join(assetsDir, filename)),
      contentType: "image/jpeg",
    },
  })));

  await Property.insertMany(documents);
  console.log("Created the six starter property listings");
}
