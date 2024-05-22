import mongoose, { Schema } from "mongoose";

const propertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: ["VILLA", "HOUSE", "LAND", "APARTMENT"],
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  refreshedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Property = mongoose.model("Property", propertySchema);
