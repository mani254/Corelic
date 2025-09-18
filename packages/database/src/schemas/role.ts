import mongoose, { InferSchemaType } from "mongoose";
import { ROLE_ACTIONS } from "../consts/dbConsts";
const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    resource: { type: String, required: true, trim: true },
    actions: [{ type: String, enum: ROLE_ACTIONS, required: true }],
  },
  { _id: false }
);

const roleSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    permissions: [permissionSchema],

    isSystem: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    archivedAt: { type: Date },
  },
  { timestamps: true }
);

roleSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export type PermissionType = InferSchemaType<typeof permissionSchema>;
export type RoleType = InferSchemaType<typeof roleSchema>;

export default mongoose.model("Role", roleSchema);
