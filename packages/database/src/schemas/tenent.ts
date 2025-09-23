import mongoose, { InferSchemaType, model } from "mongoose";
import {
  AddressSchema,
  AuditSchema,
  EMAIL_REGEX,
  SEOSchema,
  SoftDeleteSchema,
} from "./_common";
const { Schema } = mongoose;

const taxSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    percentage: { type: Number, min: 0, max: 100 },
    type: {
      type: String,
      enum: ["inclusive", "exclusive"],
      default: "exclusive",
    },
  },
  { _id: false }
);

const shippingSchema = new Schema(
  {
    regions: [{ country: String, cost: Number }],
    freeShippingOver: { type: Number },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const paymentSchema = new Schema(
  {
    methods: [{ type: String }], // e.g. 'stripe', 'paypal', 'cod'
    defaultMethod: String,
  },
  { _id: false }
);

const tenantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    domain: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending", "deleted"],
      default: "active",
      index: true,
    },
    defaultCurrency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
    },
    supportedCurrencies: [{ type: String, uppercase: true }],
    defaultLocale: { type: String, default: "en-US" },
    supportedLocales: [{ type: String, default: "en-US" }],
    settings: {
      tax: { type: taxSchema, default: {} },
      shipping: { type: shippingSchema, default: {} },
      payment: { type: paymentSchema, default: {} },
      featureFlags: {
        type: Map,
        of: Boolean,
        default: {},
      },
      custom: Schema.Types.Mixed,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: EMAIL_REGEX,
    },
    supportContact: { type: String },
    address: { type: AddressSchema },
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    seo: { type: SEOSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

tenantSchema.index({ slug: 1 }, { unique: true });

export type TenantType = InferSchemaType<typeof tenantSchema>;
export type TaxType = InferSchemaType<typeof taxSchema>;
export type ShippingType = InferSchemaType<typeof shippingSchema>;
export type PaymentType = InferSchemaType<typeof paymentSchema>;

export default model<TenantType>("Tenant", tenantSchema);
