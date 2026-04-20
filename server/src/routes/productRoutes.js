import express from 'express';
import upload from '../middlewares/upload.js';

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../controllers/productController.js';

import { authMiddleware, authorize } from '../middlewares/auth.js';

const productRouter = express.Router();

// Protect all product routes
productRouter.use(authMiddleware);

// =================================================================================================

// GET: Get all products -> admin + customer
productRouter.get('/', authorize("admin", "customer"), getAllProducts);

// GET: Get single product -> admin + customer
productRouter.get('/:id', authorize("admin", "customer"), getProductById);

// POST: Create product -> admin only
productRouter.post(
    '/',
    authorize("admin"),
    upload.single('image'),
    createProduct
);

// PUT: Update product -> admin only
productRouter.put(
    '/:id',
    authorize("admin"),
    upload.single('image'),
    updateProduct
);

// DELETE: Delete product -> admin only
productRouter.delete('/:id', authorize("admin"), deleteProduct);

export default productRouter;