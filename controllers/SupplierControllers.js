import Supplier from '../models/SuppliersModels.js'; 





export const createSupplier = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Le nom du fournisseur est requis' });
    }

    try {
        const newSupplier = new Supplier({ name });
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Données invalides', details: error.message });
        }
        if (error.code === 11000) { 
            return res.status(409).json({ error: 'Fournisseur déjà existant' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getSupplierById = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ error: 'Fournisseur non trouvé' });
        }
        res.json(supplier);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de fournisseur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Le nom du fournisseur est requis' });
    }

    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        if (!updatedSupplier) {
            return res.status(404).json({ error: 'Fournisseur non trouvé' });
        }
        res.json(updatedSupplier);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de fournisseur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        if (!deletedSupplier) {
            return res.status(404).json({ error: 'Fournisseur non trouvé' });
        }
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de fournisseur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


