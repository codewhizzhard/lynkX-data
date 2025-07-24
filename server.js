import express from "express";
import dotenv from "dotenv";
import router from "./features/user/userRoutes.js";
import connectDB from "./config/database.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5001


const app = express();

const allowedOrigin = [
    "http://localhost:5173", "https://lynkx-ui.onrender.com"
]
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

app.use(express.json());


app.use("/api/user", router);
connectDB();

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    const statusCode = err.status || 500
    const message = err.message
    res.status(statusCode).json({ message, error: err.message });
});

app.listen(PORT, () => {
    console.log( `on port: ${PORT}` );
})