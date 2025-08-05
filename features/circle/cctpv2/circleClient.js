import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


console.log("key:", process.env.CIRCLE_SANDBOX_API_KEY)
const circleClient = axios.create({
    baseURL: "https://iris-api-sandbox.circle.com",
    headers: {
        ///"Authorization": `Bearer ${process.env.CIRCLE_SANDBOX_API_KEY}`,
        "Content-Type": "application/json"
    }
})

export default circleClient