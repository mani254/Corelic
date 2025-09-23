import mongoose, { InferSchemaType } from "mongoose";
import {
  AuditSchema,
  E164_REGEX,
  EMAIL_REGEX,
  SoftDeleteSchema,
} from "./_common";
const { Schema } = mongoose;

const storeAssignmentSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role" }, // Optional, store-specific override
  },
  { _id: false }
);

const adminUserSchema = new Schema(
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
    passwordHash: { type: String, required: true },
    isTenantOwner: { type: Boolean, default: false },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    storeAssignments: [storeAssignmentSchema],
    status: {
      type: String,
      enum: ["invited", "active", "suspended"],
      default: "active",
      index: true,
    },
    name: { type: String, trim: true },
    phone: { type: String, trim: true, match: E164_REGEX },
    lastLoginAt: { type: Date },
    mfa: {
      enabled: { type: Boolean, default: false },
      method: { type: String, enum: ["totp", "webauthn"], default: "totp" },
    },
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Indexes for uniqueness and fast lookups
adminUserSchema.index({ tenantId: 1, email: 1 }, { unique: true });
adminUserSchema.index({ tenantId: 1, "storeAssignments.storeId": 1 });

// TypeScript types for AdminUser and StoreAssignment
export type StoreAssignmentType = InferSchemaType<typeof storeAssignmentSchema>;
export type AdminUserType = InferSchemaType<typeof adminUserSchema>;

const AdminUserModel = mongoose.model("AdminUser", adminUserSchema);
export default AdminUserModel;
