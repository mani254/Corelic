import mongoose, { InferSchemaType } from "mongoose";
import {
  AuditSchema,
  ImageSchema,
  MoneySchema,
  SEOSchema,
  SLUG_REGEX,
  SoftDeleteSchema,
} from "./_common";
const { Schema } = mongoose;

// Inventory/price per "option" (size), per store
const optionInventorySchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true },
    comparePrice: { type: Number, min: 0 },
    sku: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Size/option under each color variant
const optionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g., "S", "M", "L", etc.
    inventories: [optionInventorySchema], // per store, per option
  },
  { _id: false }
);

// Variant schema (per color)
const variantSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    color: { type: String, required: true, trim: true, index: true },
    images: [ImageSchema],
    options: [optionSchema], // each color has list of sizes/options
    additionalAttributes: { type: Map, of: String }, // extensible: material, hex code, etc.
  },
  { timestamps: true }
);

// Main Product schema
const productSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    title: { type: String, required: true, maxlength: 150, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: SLUG_REGEX,
      index: true,
    },
    overview: { type: String, maxlength: 450, trim: true },
    description: { type: String, trim: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Brand" },
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    images: { type: [ImageSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "draft",
      index: true,
    },
    gst: { type: Number, default: 0, min: 0 },
    trackInventory: { type: Boolean, default: false },
    basePrice: { type: MoneySchema },
    priceRange: {
      min: { type: MoneySchema },
      max: { type: MoneySchema },
    },
    ratingSummary: {
      avg: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0, min: 0 },
    },
    attributes: { type: Map, of: String },
    seo: { type: SEOSchema, default: {} },
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

productSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
productSchema.index({ tenantId: 1, title: 1 });
productSchema.index({ tenantId: 1, status: 1 });
productSchema.index(
  { title: "text", overview: "text", description: "text" },
  { weights: { title: 5, overview: 3, description: 1 } }
);

export type ProductType = InferSchemaType<typeof productSchema>;
export type OptionType = InferSchemaType<typeof optionSchema>;
export type OptionInventoryType = InferSchemaType<typeof optionInventorySchema>;
export type VariantType = InferSchemaType<typeof variantSchema>;

// Export models
const ProductModel = mongoose.model("Product", productSchema);
const VariantModel = mongoose.model("Variant", variantSchema);

export { ProductModel, VariantModel };
export default ProductModel;
