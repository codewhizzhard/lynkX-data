import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./features/user/userRoutes.js";
import connectDB from "./config/database.js";
import cors from "cors";
import circleRouter from "./features/circle/circleRoute.js";
import cctpv2Router from "./features/circle/cctpv2/cctpv2Routes.js";
import abiRouter from "./features/circle/cctpv2/cctpv2Abi.js";

const PORT = process.env.PORT || 5001

//console.log('API Key ->', process.env.API_KEY);
const app = express();

const allowedOrigin = [
    "http://localhost:5174", "https://lynkx-ui.onrender.com"
]
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

app.use(express.json());


app.use("/api/user", router);
app.use("/api/users", cctpv2Router)
app.use("/api/user", circleRouter);


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