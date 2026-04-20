import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
    createOrder,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ====================================================================================================
// ORDER ROUTES
// ====================================================================================================

// Protect all order routes (User must be logged in)
orderRouter.use(authMiddleware);

// ====================================================================================================

// Admin Routes
// GET: Admin gets all orders
orderRouter.get("/", authorize("admin"), getAllOrders);

// PATCH: Admin updates order status
orderRouter.patch("/:id", authorize("admin"), updateOrderStatus);

// ====================================================================================================

// Customer Routes
// POST: Customer creates order
orderRouter.post("/", authorize("customer"), createOrder);

export default orderRouter;


