import Agency from '../models/AgencyModels.js';
import Distribute from '../models/DistributeModels.js'; 
import Product from '../models/ProductsModels.js'; 
import mongoose from 'mongoose';



export const createDistribution = async (req, res) => {
    const { code_produit, produit, quantite, destinataire, fournisseur, date } = req.body;

    if (!code_produit || !produit || !quantite || !destinataire || !fournisseur || !date) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        const productFound = await Product.findOne({ code_produit });
        if (!productFound) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        if (!mongoose.Types.ObjectId.isValid(produit)) {
            return res.status(400).json({ error: 'ID de produit invalide' });
        }

        if (quantite > productFound.quantity) {
            return res.status(400).json({ error: 'Quantité demandée est supérieure à la quantité disponible' });
        }

        
        const agences = await Agency.find(); 
        const validAgencyIds = agences.map(agence => agence._id.toString()); 

        if (!validAgencyIds.includes(destinataire)) {
            return res.status(400).json({ error: 'Localisation non valide' });
        }

        const distribution = new Distribute({
            code_produit,
            produit,
            quantite,
            destinataire,
            fournisseur,
            date,
        });

        await distribution.save();

        productFound.quantity -= quantite;
        await productFound.save();

        res.status(201).json(distribution);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Erreur de validation', details: error.message });
        }

        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};






export const getUserDistributions = async (req, res) => {
    const userId = req.params.userId; 

    try {
        const distributions = await Distribute.find({ user: userId }).populate('product');
        res.status(200).json(distributions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};



export const getDistributionById = async (req, res) => {
    try {
        const distribution = await Distribute.findById(req.params.id)
        .populate('code_produit')
        .populate('product')
        .populate('Agency')
        .populate('supplier')
        .populate('destinataire')
        .populate('date');
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(200).json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateDistribution = async (req, res) => {
    try {
        const distribution = await Distribute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(200).json(distribution);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteDistribution = async (req, res) => {
    try {
        const distribution = await Distribute.findByIdAndDelete(req.params.id);
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

