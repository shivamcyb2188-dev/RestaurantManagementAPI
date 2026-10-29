
const pool = require("../config/db");

// Get menu items with optional search and filters
exports.getMenu = async (req, res) => {
    try {
        const { search, category, available } = req.query;

        const validCategories = [
            "Starter",
            "Main Course",
            "Dessert",
            "Drinks"
        ];

        const conditions = [];
        const values = [];

        // Search by food name or description
        if (search && search.trim()) {
            conditions.push("(name LIKE ? OR description LIKE ?)");
            const keyword = `%${search.trim()}%`;
            values.push(keyword, keyword);
        }

        // Filter by category
        if (category) {
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category",
                    validCategories
                });
            }

            conditions.push("category = ?");
            values.push(category);
        }

        // Filter by availability
        if (available !== undefined) {
            if (available !== "true" && available !== "false") {
                return res.status(400).json({
                    success: false,
                    message: "Available must be true or false"
                });
            }

            conditions.push("is_available = ?");
            values.push(available === "true" ? 1 : 0);
        }

        let sql = "SELECT * FROM menu_items";

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY id DESC";

        const [items] = await pool.query(sql, values);

        return res.json({
            success: true,
            count: items.length,
            menu: items
        });
    } catch (error) {
        console.error("Get menu error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch menu"
        });
    }
};


// Add a menu item (admin only)
exports.addMenuItem = async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            description,
            image_url,
            is_available
        } = req.body;

        const validCategories = [
            "Starter",
            "Main Course",
            "Dessert",
            "Drinks"
        ];

        if (!name || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name, category and price are required"
            });
        }

        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid non-negative number"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO menu_items
            (name, category, price, description, image_url, is_available)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                category,
                Number(price),
                description || null,
                image_url || null,
                is_available === undefined
                    ? true
                    : is_available === true || is_available === 1
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Menu item added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add menu error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add menu item"
        });
    }
};


// Update a menu item (admin only)
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            category,
            price,
            description,
            image_url,
            is_available
        } = req.body;

        const validCategories = [
            "Starter",
            "Main Course",
            "Dessert",
            "Drinks"
        ];

        if (
            category !== undefined &&
            !validCategories.includes(category)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        if (
            price !== undefined &&
            (!Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid non-negative number"
            });
        }

        if (
            is_available !== undefined &&
            typeof is_available !== "boolean" &&
            is_available !== 0 &&
            is_available !== 1
        ) {
            return res.status(400).json({
                success: false,
                message: "is_available must be true or false"
            });
        }

        const [result] = await pool.query(
            `UPDATE menu_items SET
                name = COALESCE(?, name),
                category = COALESCE(?, category),
                price = COALESCE(?, price),
                description = COALESCE(?, description),
                image_url = COALESCE(?, image_url),
                is_available = COALESCE(?, is_available)
             WHERE id = ?`,
            [
                name ?? null,
                category ?? null,
                price === undefined ? null : Number(price),
                description ?? null,
                image_url ?? null,
                is_available === undefined
                    ? null
                    : (is_available === true || is_available === 1 ? 1 : 0),
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found or no changes made"
            });
        }

        return res.json({
            success: true,
            message: "Menu item updated successfully"
        });
    } catch (error) {
        console.error("Update menu error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update menu item"
        });
    }
};


// Delete a menu item (admin only)
exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM menu_items WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        return res.json({
            success: true,
            message: "Menu item deleted successfully"
        });
    } catch (error) {
        console.error("Delete menu error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete menu item"
        });
    }
};
