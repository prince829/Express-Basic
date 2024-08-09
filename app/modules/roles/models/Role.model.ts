import { Schema, model } from "mongoose";
import { RoleDocument } from "../../../interface/RoleInterface.js";
const RoleSchema = new Schema<RoleDocument>({
    roleDisplayName: { type: String, default: '' },
    role: { type: String, default: '' },
    desc: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false }
}, { versionKey: false, timestamps: true });

const roleModel = model<RoleDocument>('Role', RoleSchema);
export { roleModel };
export type { RoleDocument }
