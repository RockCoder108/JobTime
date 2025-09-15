import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";



// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*", // Adjust this in production to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());




// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));