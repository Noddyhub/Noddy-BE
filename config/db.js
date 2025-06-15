import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB 연결 성공");
  } catch (err) {
    console.error("MongoDB 연결 실패:", err);
    process.exit(1);
  }
};

export default connectMongoDB;
