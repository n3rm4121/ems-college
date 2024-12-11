import mongoose from 'mongoose';

export default async function dbConnect() {
    const uri = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME;
    console.log('uri:', uri);



    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
        console.log('Already connected to MongoDB');
        return mongoose.connection.asPromise();
    }

    console.log('Connecting to MongoDB...');

    try {
        const connection = await mongoose.connect(`${uri}/${DB_NAME}`, {
            writeConcern: { w: 'majority' }, // Default write concern
        });

        console.log('MongoDB connection established.');
        return connection;
    } catch (error) {
        if (error instanceof Error) {
            console.error('MongoDB connection failed:', error.message);
        } else {
            console.error('MongoDB connection failed:', error);
        }
        throw error;
    }
}
