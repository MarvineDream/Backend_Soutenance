import express from 'express';
import { addProduct, createProduct, deleteProduct, getProductsByCategory, getProductsBySupplier, updateProduct } from '../controllers/ProductControllers.js';

const router = express.Router();

router.post('/', createProduct);
router.post('/admin/create-Product', addProduct)
router.get('/supplier/:supplierId', getProductsBySupplier);
router.get('/category/:categoryId', getProductsByCategory);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


export default router;