import express from 'express';
import { createStockMovement, deleteStockMovement, getStockMovementById, getStockMovements, updateStockMovement } from '../controllers/StockMovementControllers.js';

const router = express.Router();

router.post('/', createStockMovement);
router.get('/', getStockMovements);
router.get('/:id', getStockMovementById);
router.put('/:id', updateStockMovement);
router.delete('/:id', deleteStockMovement);

export default router;

