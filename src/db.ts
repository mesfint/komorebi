import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connection established");
  } catch (error) {
    console.log("error in connectToDatabase", error);
    throw error;
  }
};
