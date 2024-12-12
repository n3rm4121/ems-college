import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: "teacher" | "student" | "admin";
}

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student", "admin"] },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
