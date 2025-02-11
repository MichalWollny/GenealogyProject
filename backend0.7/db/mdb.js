import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionString = `${process.env.MONGO_DB_URI}${process.env.MONGO_DB_COL}`;
    const connection = await mongoose.connect(connectionString, {});

    console.log("Connected to MongoDB");
    console.log(connection.connection.db.databaseName);
  } catch (error) {
    console.error("Connection error:", error);
  }
};

connectDB();
