import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from "../config.js"

async function connect(){
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

    mongoose.set('strictQuery', true)
    const db = mongoose.connect(ENV.MONGO_URI)
    console.log("Database connected")
}

export default connect