import mongoose from "mongoose";
import Product from "../models/product.js";
import path from "path";
import { promises as fsPromises } from "fs";


// ====================================================================================================
// PRODUCT CONTROLLER
// ====================================================================================================
// GET: Get all products
// GET: Get product by ID
// POST: Create product
// PUT: Update product
// DELETE: Delete a product
// ====================================================================================================


// ====================================================================================================
// GET: Get all products
// ====================================================================================================
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean(); // Add .lean() for plain JS objects

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
// GET: Get product by ID
// ====================================================================================================
export const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.json({
            ...product._doc,
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

        if (!name || !description || price == null || stock == null)
            return res.status(400).json({ message: "All fields are required" });

        if (!req.file)
            return res.status(400).json({ message: "Product image is required" });

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            image: req.file ? req.file.filename : null
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

        const updateData = { name, description, price, stock };

        if (req.file) {
            updateData.image = req.file ? req.file.filename : null
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: "after" }
        );

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ====================================================================================================
// DELETE: Delete a product
// ====================================================================================================
export const deleteProduct = async (req, res) => {
    try {
        // Find the product first
        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        // Delete the image file if it exists
        if (product.image) {
            const imagePath = path.join(process.cwd(), "uploads", product.image);
            await fsPromises.unlink(imagePath).catch(err => {
                console.error("Failed to delete image file:", err.message);
            });
        }

        // Delete the product from DB
        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product and its image deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

