import mongoose, { InferSchemaType } from "mongoose";
const { Schema } = mongoose;

// Shared: Regexes and constants
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const E164_REGEX = /^\+?[1-9]\d{1,14}$/;

// Shared: Image
export const ImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false }
);

// Shared: SEO
export const SEOSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 160 },
    keywords: [{ type: String, trim: true, lowercase: true }],
  },
  { _id: false }
);

// Shared: Address
export const AddressSchema = new Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, required: true, trim: true, default: "US" },
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

// Shared: Money (amount in major units for now; switch to minor if needed)
export const MoneySchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },
  },
  { _id: false }
);

// Shared: Audit
export const AuditSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { _id: false }
);

// Shared: Soft delete
export const SoftDeleteSchema = new Schema(
  {
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { _id: false }
);

export type ImageType = InferSchemaType<typeof ImageSchema>;
export type SEOType = InferSchemaType<typeof SEOSchema>;
export type AddressType = InferSchemaType<typeof AddressSchema>;
export type MoneyType = InferSchemaType<typeof MoneySchema>;
export type AuditType = InferSchemaType<typeof AuditSchema>;
export type SoftDeleteType = InferSchemaType<typeof SoftDeleteSchema>;
