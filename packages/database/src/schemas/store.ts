import mongoose, { InferSchemaType } from "mongoose";
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, index: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true, default: "US" },
  },
  { _id: false }
);

const storeSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: addressSchema, required: true },

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
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

storeSchema.index({ tenantId: 1, name: 1 }, { unique: true });

storeSchema.index({ location: "2dsphere" });

export type StoreType = InferSchemaType<typeof storeSchema>;
export type AddressType = InferSchemaType<typeof addressSchema>;

export default mongoose.model("Store", storeSchema);
