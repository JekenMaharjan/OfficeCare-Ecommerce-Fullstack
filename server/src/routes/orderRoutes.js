import express from "express"
import { adminMiddleware, authMiddleware, authorize } from "../middlewares/auth.js";
import {
    createOrder,
    getAllOrders,
    updateOrderStatus

} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ====================================================================================================
// ORDER ROUTES
// ====================================================================================================

// Protect all order routes
orderRouter.use(authMiddleware);

// =================================================================================================

// GET: Admin gets all orders -> admin only
orderRouter.get("/", authorize("admin"), getAllOrders);

// POST: Customer creates order -> customer only
orderRouter.post("/", authorize("customer"), createOrder);

// PATCH: Admin updates order status -> admin only
orderRouter.patch("/:id", authorize("admin"), updateOrderStatus);

export default orderRouter;