import "dotenv/config"; // Loads variables from .env file
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js"; 
import { connectMongo } from "./src/config/mongo.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON body

// 2. Connect to Database
connectMongo()
    .then(() => console.log("MongoDB Connected via Server"))
    .catch(err => console.error("DB Connection Failed:", err));

// 3. API Routes
app.use("/api", router);

// 4. Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server" });
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});