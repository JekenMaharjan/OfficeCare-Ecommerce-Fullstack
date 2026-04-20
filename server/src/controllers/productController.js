import mongoose from "mongoose";
import Product from "../models/product.js";
import path from "path";
import { promises as fs } from "fs";

// ====================================================================================================
// PRODUCT CONTROLLER
// ====================================================================================================
// GET: All products
// GET: Product by ID
// POST: Create product
// PUT: Update product
// DELETE: Product + image
// ====================================================================================================

// ====================================================================================================
// GET: All products
// ====================================================================================================
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();

        const formatted = products.map((product) => ({
            ...product,
            image: product.image ? `/uploads/${product.image}` : null,
        }));

        res.status(200).json(formatted);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ====================================================================================================
// GET: Product by ID
// ====================================================================================================
export const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            ...product,
            image: product.image ? `/uploads/${product.image}` : null,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ====================================================================================================
// POST: Create product
// ====================================================================================================
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        if (!name || !description || price == null || stock == null) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Product image is required"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            image: req.file.filename
        });

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ====================================================================================================
// PUT: Update product
// ====================================================================================================
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        const updateData = {
            name,
            description,
            price,
            stock
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ====================================================================================================
// DELETE: Product + image
// ====================================================================================================
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete image safely
        if (product.image) {
            const imagePath = path.join(process.cwd(), "uploads", product.image);

            await fs.unlink(imagePath).catch((err) => {
                console.error("Image delete failed:", err.message);
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};