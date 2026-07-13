import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    location: { type: String, required: true, trim: true, maxlength: 180, index: true },
    area: { type: String, required: true, trim: true, maxlength: 80 },
    property_type: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 5000, default: "" },
    youtube_url: { type: String, trim: true, maxlength: 500, default: "" },
    bedrooms: { type: Number, min: 0, default: null },
    bathrooms: { type: Number, min: 0, default: null },
    status: { type: String, enum: ["Available", "Sold", "Rented"], default: "Available", index: true },
    featured: { type: Boolean, default: false, index: true },
    image: {
      data: { type: Buffer, select: false },
      contentType: { type: String },
    },
    images: [{
      data: { type: Buffer, select: false },
      contentType: { type: String, required: true },
    }],
  },
  { timestamps: true, autoIndex: false },
);

propertySchema.index({ featured: -1, createdAt: -1 });

export const Property = mongoose.model("Property", propertySchema);
