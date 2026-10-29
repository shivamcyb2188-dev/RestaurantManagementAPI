
const pool = require("../config/db");

// Customer: place a new order
const createOrder = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { items } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one food item"
            });
        }

        await connection.beginTransaction();

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const foodId = Number(item.food_id);
            const quantity = Number(item.quantity);

            if (!Number.isInteger(foodId) || foodId <= 0 ||
                !Number.isInteger(quantity) || quantity <= 0) {
                throw new Error("Invalid food_id or quantity");
            }

            const [foods] = await connection.query(
                "SELECT id, name, price FROM menu_items WHERE id = ? AND is_available = TRUE",
                [foodId]
            );

            if (foods.length === 0) {
                throw new Error(`Food item ${foodId} not found or unavailable`);
            }

            const food = foods[0];
            const price = Number(food.price);

            totalPrice += price * quantity;

            orderItems.push({
                foodId,
                quantity,
                price
            });
        }

        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
            [userId, totalPrice]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await connection.query(
                "INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, item.foodId, item.quantity, item.price]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order_id: orderId,
            total_price: totalPrice,
            status: "Pending"
        });

    } catch (error) {
        await connection.rollback();

        res.status(400).json({
            success: false,
            message: error.message || "Failed to place order"
        });

    } finally {
        connection.release();
    }
};

// Customer: view own orders
const getMyOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.id, o.total_price, o.status, o.created_at,
                    oi.food_id, m.name AS food_name, oi.quantity, oi.price
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN menu_items m ON oi.food_id = m.id
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get my orders error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch your orders"
        });
    }
};

// Admin: view all orders
const getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.id, o.user_id, u.name AS customer_name,
                    o.total_price, o.status, o.created_at,
                    oi.food_id, m.name AS food_name, oi.quantity, oi.price
             FROM orders o
             JOIN users u ON o.user_id = u.id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN menu_items m ON oi.food_id = m.id
             ORDER BY o.created_at DESC`
        );

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Get all orders error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = [
            "Pending",
            "Preparing",
            "Out for delivery",
            "Delivered"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const [result] = await pool.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            status
        });
    } catch (error) {
        console.error("Update order status error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};
