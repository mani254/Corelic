// models/brand.model.js
import mongoose, { InferSchemaType } from "mongoose";
import slugify from "slugify";
import {
  AuditSchema,
  ImageSchema,
  SEOSchema,
  SLUG_REGEX,
  SoftDeleteSchema,
} from "./_common";

const { Schema, model } = mongoose;

const brandSchema = new Schema(
  {
    // Tenant scope (multi-tenant support)
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Brand title is required"],
      maxlength: [60, "Brand title should be less than 60 characters"],
      trim: true,
    },

    slug: { type: String, lowercase: true, trim: true, match: SLUG_REGEX },

    description: {
      type: String,
      maxlength: [450, "Description should be less than 450 characters"],
      trim: true,
    },

    // SEO metadata
    seo: { type: SEOSchema, default: {} },

    // ✅ Brand logo
    logo: { type: ImageSchema },

    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0, min: 0 },
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// --- Indexes ---
brandSchema.index({ tenantId: 1, title: 1 });
brandSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
brandSchema.index({ tenantId: 1, isActive: 1 });

// --- Hooks ---
brandSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Brand = model("Brand", brandSchema);

export type BrandDocument = InferSchemaType<typeof brandSchema> & {
  _id: mongoose.Types.ObjectId;
};
