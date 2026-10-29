
const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

// Customer: place a new order
router.post("/", verifyToken, createOrder);

// Customer: view own orders
router.get("/my-orders", verifyToken, getMyOrders);

// Admin: view all orders
router.get("/", verifyToken, verifyAdmin, getAllOrders);

// Admin: update order status
router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
