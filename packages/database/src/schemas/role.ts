import mongoose, { InferSchemaType } from "mongoose";
import { ROLE_ACTIONS } from "../consts/dbConsts";
import { AuditSchema, SLUG_REGEX, SoftDeleteSchema } from "./_common";
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
    slug: { type: String, trim: true, lowercase: true, match: SLUG_REGEX },
    description: { type: String, trim: true },

    permissions: [permissionSchema],

    isSystem: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    archivedAt: { type: Date },
    audit: { type: AuditSchema, default: {} },
    softDelete: { type: SoftDeleteSchema, default: {} },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

roleSchema.index({ tenantId: 1, slug: 1 }, { unique: true, sparse: true });
roleSchema.index({ tenantId: 1, name: 1 });

export type PermissionType = InferSchemaType<typeof permissionSchema>;
export type RoleType = InferSchemaType<typeof roleSchema>;

const RoleModal = mongoose.model("Role", roleSchema);
export default RoleModal;
