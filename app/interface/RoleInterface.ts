import { Document, Types } from "mongoose";

export interface RoleDocument extends Document {
    roleDisplayName: string;
    role: string;
    desc: string;
    isDeleted: boolean;
    _id:Types.ObjectId|string;
} 