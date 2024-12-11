import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: string;
}

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String ,  enum: ['teacher', 'student']},
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
