import mongoose, { InferSchemaType } from "mongoose";
import {
  AuditSchema,
  ImageSchema,
  SEOSchema,
  SLUG_REGEX,
  SoftDeleteSchema,
} from "./_common";
const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 60,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: SLUG_REGEX,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 450,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    image: { type: ImageSchema },
    showInHome: { type: Boolean, default: false },
    seo: { type: SEOSchema, default: {} },
    sortOrder: { type: Number, default: 0, index: true },

    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Compound unique index for tenant-scope safety
collectionSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
collectionSchema.index({ tenantId: 1, title: 1 });
collectionSchema.index({ tenantId: 1, sortOrder: 1 });

export type CollectionType = InferSchemaType<typeof collectionSchema>;

const CollectionModel = mongoose.model("Collection", collectionSchema);
export default CollectionModel;
