
const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");
const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Menu route working!"
    });
});

router.get("/", menuController.getMenu);

router.post(
    "/",
    verifyToken,
    verifyAdmin,
    menuController.addMenuItem
);

router.put(
    "/:id",
    verifyToken,
    verifyAdmin,
    menuController.updateMenuItem
);

router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    menuController.deleteMenuItem
);

module.exports = router;
