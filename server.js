import express from "express";
import dotenv from "dotenv";
import router from "./features/user/userRoutes.js";
import connectDB from "./config/database.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5001


const app = express();
connectDB();
app.use(express.json());
app.listen(PORT, () => {
    console.log( `on port: ${PORT}` );
})
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/user/", router);