import mongoose, { InferSchemaType } from "mongoose";
import {
  AddressSchema,
  AuditSchema,
  E164_REGEX,
  EMAIL_REGEX,
  SoftDeleteSchema,
} from "./_common";
const { Schema } = mongoose;

// Address sub-schema, used for billing/shipping
const addressBookSchema = new Schema(
  {
    label: { type: String, default: "default" },
    isDefault: { type: Boolean, default: false },
    address: { type: AddressSchema, required: true },
  },
  { _id: false }
);

const clientUserSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: EMAIL_REGEX,
      index: true,
    },
    phone: { type: String, trim: true, index: true, match: E164_REGEX },
    name: { type: String, trim: true },
    addresses: [addressBookSchema],
    passwordHash: { type: String },

    marketing: {
      emailOptIn: { type: Boolean, default: false },
      smsOptIn: { type: Boolean, default: false },
    },

    stats: {
      ordersCount: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
    },
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

clientUserSchema.index({ tenantId: 1, email: 1 }, { unique: true });
clientUserSchema.index(
  { tenantId: 1, phone: 1 },
  { unique: true, sparse: true }
);

// TypeScript type exports
export type AddressBookType = InferSchemaType<typeof addressBookSchema>;
export type ClientUserType = InferSchemaType<typeof clientUserSchema>;

const ClientUserModel = mongoose.model("ClientUser", clientUserSchema);
export default ClientUserModel;
