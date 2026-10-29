
const express = require("express");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(express.json());

// Request logger - debugging ke liye
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

// Menu routes
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);

// Temporary route to test the server
app.get("/menu-check", (req, res) => {
    res.json({
        success: true,
        message: "Menu path check working!"
    });
});

// Authentication routes
app.use("/", authRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Restaurant Management API is running!"
    });
});

// Database connection test
app.get("/db-test", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS result");

        res.json({
            success: true,
            message: "MySQL connected successfully!",
            result: rows[0].result
        });
    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Handle unknown routes

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
