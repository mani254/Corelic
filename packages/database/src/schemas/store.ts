import mongoose, { InferSchemaType } from "mongoose";
import { AddressSchema, AuditSchema, SoftDeleteSchema } from "./_common";
const { Schema } = mongoose;

const storeSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    code: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    address: { type: AddressSchema, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: (arr: [number, number]) =>
            arr.length === 2 && arr.every(Number.isFinite),
          message: "Coordinates must be [longitude, latitude].",
        },
      },
    },

    timezone: { type: String, required: true, default: "UTC" },

    displayCurrency: { type: String, uppercase: true },

    managerAdminIds: [{ type: Schema.Types.ObjectId, ref: "AdminUser" }],
    supportContacts: [{ type: String, trim: true }],

    isActive: { type: Boolean, default: true },
    openedAt: { type: Date },

    tags: [{ type: String, trim: true, lowercase: true }],
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

storeSchema.index({ tenantId: 1, code: 1 }, { unique: true });
storeSchema.index({ tenantId: 1, name: 1 });

storeSchema.index({ location: "2dsphere" });

export type StoreType = InferSchemaType<typeof storeSchema>;

const StoreModel = mongoose.model("Store", storeSchema);
export default StoreModel;
