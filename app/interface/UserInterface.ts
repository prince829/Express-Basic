import { RequestHandler } from "express";
import { AggregatePaginateModel, Document, Types } from "mongoose";

export interface UserDocument extends Document {
    first_name: string;
    last_name: string;
    full_name: string;
    username:string;
    role: string|Types.ObjectId;
    phone:string;
    email:string;
    dob:string;
    password:string;
    profile_image:string;
    registerType:string,
    otp:string;
    otp_updatedAt:Date;
    is_forgot_password_mail_active:boolean;
    isDeleted:boolean;
    status:string;
    _id:Types.ObjectId|string;
};
export interface UserModelAggregate extends AggregatePaginateModel<UserDocument>{}
export type CreateUser={
    email:string
    password:string
    confirm_password:string;
    full_name?:string;
    first_name:string;
    last_name:string;

}