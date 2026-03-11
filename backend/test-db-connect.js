import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const uri = "mongodb://kenanaponso_db_user:2MrG9zhkITMBarpK@ac-n0ivmhc-shard-00-00.pirjtv0.mongodb.net:27017,ac-n0ivmhc-shard-00-01.pirjtv0.mongodb.net:27017,ac-n0ivmhc-shard-00-02.pirjtv0.mongodb.net:27017/orato?ssl=true&replicaSet=atlas-unms6x-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const testConnect = async () => {
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected with Direct String");
        process.exit(0);
    } catch (error) {
        console.error("❌ DB connection failed:", error.message);
        process.exit(1);
    }
};

testConnect();
