import StockMovement from '../models/StockMovementsModels.js';


export const createStockMovement = async (req, res) => {
    try {
        const stockMovement = new StockMovement(req.body);
        await stockMovement.save();
        res.status(201).json(stockMovement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getStockMovements = async (req, res) => {
    try {
        const stockMovements = await StockMovement.find().populate('product');
        res.status(200).json(stockMovements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getStockMovementById = async (req, res) => {
    try {
        const stockMovement = await StockMovement.findById(req.params.id).populate('product');
        if (!stockMovement) return res.status(404).json({ message: 'Mouvement de stock non trouvé' });
        res.status(200).json(stockMovement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateStockMovement = async (req, res) => {
    try {
        const stockMovement = await StockMovement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!stockMovement) return res.status(404).json({ message: 'Mouvement de stock non trouvé' });
        res.status(200).json(stockMovement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteStockMovement = async (req, res) => {
    try {
        const stockMovement = await StockMovement.findByIdAndDelete(req.params.id);
        if (!stockMovement) return res.status(404).json({ message: 'Mouvement de stock non trouvé' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


