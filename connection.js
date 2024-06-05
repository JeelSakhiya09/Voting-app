import mongoose from "mongoose";

export async function connectMongoDB() {
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/voter`);
        console.log("MongoDB connected DB host ::", connectionInstance.connection.host);
    } catch (err) {
        console.log(err);
    }
}