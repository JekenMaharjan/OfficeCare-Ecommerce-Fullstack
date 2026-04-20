import Cart from "../models/cart.js";
import Product from "../models/product.js";

// ====================================================================================================
// CART CONTROLLER
// ====================================================================================================
// GET: Get cart count
// GET: Get all cart items
// POST: Add product to cart
// PATCH: Update cart quantity (NO STOCK CHANGE HERE)
// DELETE: Remove item from cart (NO STOCK CHANGE HERE)
// ====================================================================================================

// ====================================================================================================
// GET: Get cart count
// ====================================================================================================
export const getCartCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        const count = cart
            ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
            : 0;

        res.status(200).json({ count });

    } catch (error) {
        console.error("Cart count error:", error);
        res.status(500).json({ count: 0 });
    }
};

// ====================================================================================================
// GET: Get all cart items
// ====================================================================================================
export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        res.status(200).json(cart || { items: [] });

    } catch (error) {
        console.error("Get cart items error:", error);
        res.status(500).json({ items: [] });
    }
};

// ====================================================================================================
// POST: Add product to cart
// ====================================================================================================
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });

            return res.status(201).json(cart);
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            const newQty = cart.items[itemIndex].quantity + quantity;

            if (product.stock < newQty) {
                return res.status(400).json({ message: "Not enough stock" });
            }

            cart.items[itemIndex].quantity = newQty;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Failed to add to cart" });
    }
};

// ====================================================================================================
// PATCH: Update cart quantity (NO STOCK CHANGE HERE)
// ====================================================================================================
export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, action } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (i) => i.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (action === "increase") {
            item.quantity += 1;
        }

        if (action === "decrease") {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart.items = cart.items.filter(
                    (i) => i.product.toString() !== productId
                );
            }
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ message: "Failed to update cart" });
    }
};

// ====================================================================================================
// DELETE: Remove item from cart (NO STOCK CHANGE HERE)
// ====================================================================================================
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        console.error("Remove cart error:", error);
        res.status(500).json({ message: "Failed to remove item" });
    }
};