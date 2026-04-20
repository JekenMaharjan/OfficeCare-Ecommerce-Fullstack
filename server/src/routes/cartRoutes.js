import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";

import {
    addToCart,
    getCartCount,
    getCartItems,
    removeFromCart,
    updateCartQuantity,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

// ====================================================================================================
// CART ROUTES
// ====================================================================================================

// Protect all cart routes
cartRouter.use(authMiddleware);

// ====================================================================================================

// GET: Get cart count
cartRouter.get("/count", authorize("customer"), getCartCount);

// GET: Get cart items
cartRouter.get("/items", authorize("customer"), getCartItems);

// POST: Add to cart
cartRouter.post("/", authorize("customer"), addToCart);

// PATCH: Update quantity
cartRouter.patch("/quantity", authorize("customer"), updateCartQuantity);

// DELETE: Remove item
cartRouter.delete("/", authorize("customer"), removeFromCart);

export default cartRouter;