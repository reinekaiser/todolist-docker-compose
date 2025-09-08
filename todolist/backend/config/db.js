import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connect = async (app) => {
    const connectWithRetry = async () => {
        try {
            console.log("Đang kết nối MongoDB...");
            await mongoose.connect(process.env.MONGODB_URI, { dbName: "todo" });
            console.log("✅ MongoDB đã kết nối thành công");
        } catch (err) {
            console.error("❌ Kết nối MongoDB thất bại. Thử lại sau 2s.", err);
            setTimeout(connectWithRetry, 2000);
        }
    };

    connectWithRetry();
};