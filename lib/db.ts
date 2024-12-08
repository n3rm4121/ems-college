import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable");
}

export const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    return mongoose.connect(MONGO_URI);
};
