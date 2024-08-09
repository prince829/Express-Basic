import { Schema, model } from "mongoose";
import { UserDocument, UserModelAggregate } from "../../../interface/UserInterface.js";
const registerType = ['Normal', 'Phone', 'Google', 'Facebook', 'Apple'];
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const UserSchema = new Schema<UserDocument>({
    first_name: { type: String, default: '', index: true },
    last_name: { type: String, default: '', index: true },
    full_name: { type: String, default: '', index: true },
    username: { type: String, default: '', index: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', default: null, index: true },
    phone: { type: String, default: '', index: true },
    email: { type: String, default: '', index: true },
    dob: { type: String, default: null },
    password: { type: String, default: '' },
    profile_image: { type: String, default: '' },
    registerType: { type: String, default: 'Normal', enum: registerType },
    otp: { type: String, default: '' },
    otp_updatedAt: { type: Date, default: null },
    is_forgot_password_mail_active:{type:Boolean,default:false},
    isDeleted: { type: Boolean, default: false, index: true },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'], index: true }
}, { versionKey: false, timestamps: true });

UserSchema.plugin(aggregatePaginate)

export const userModel = model<UserDocument,UserModelAggregate>("User", UserSchema);
export type { UserDocument }
