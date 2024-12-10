import ConsumptionReport from '../models/ConsumptionReportsModels.js';
import { body, validationResult } from 'express-validator';
import authenticate from '../middleware/auth.js';



const validateConsomptionReport = [
    body('agency').notEmpty().withMessage('L\'agence est requise.'),
    body('product').isMongoId().withMessage('L\'ID du produit est invalide.'),
    body('totalConsumed').isNumeric().withMessage('Le total consommé doit être un nombre.'),
    body('dateRange').notEmpty().withMessage('La période est requise.')
]; 



const generateWeeklyConsumptionReport = async (req, res) => {
    const startDate = new Date();
    const endDate = new Date();


    startDate.setDate(startDate.getDate() - (startDate.getDay() + 7)); 
    endDate.setDate(endDate.getDate() - (endDate.getDay() + 1)); 

    try {
        const reports = await ConsumptionReport.find({
            date: { $gte: startDate, $lt: endDate }
        })
        .populate('product')
        .populate('agency')
        .populate('supplier');

        
        const aggregatedReports = reports.reduce((acc, report) => {
            const key = `${report.produit.name} - ${report.agence.name}`;
            if (!acc[key]) {
                acc[key] = { product: report.produit.name, agency: report.agence.name, totalQuantity: 0 };
            }
            acc[key].totalQuantity += report.quantity;
            return acc;
        }, {});

        res.status(200).json(Object.values(aggregatedReports));
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};




const createConsumptionReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { agency, product, totalConsumed, dateRange } = req.body;

    try {
        const newReport = new ConsumptionReport({ agency, product, totalConsumed, dateRange });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const getConsumptionReports = async (req, res) => {
    try {
        const reports = await ConsumptionReport.find().populate('product');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const getConsumptionReportById = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await ConsumptionReport.findById(id).populate('product');
        if (!report) {
            return res.status(404).json({ error: 'Rapport non trouvé' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const updateConsumptionReport = async (req, res) => {
    const { id } = req.params;
    const { agency, product, totalConsumed, dateRange } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedReport = await ConsumptionReport.findByIdAndUpdate(
            id,
            { agency, product, totalConsumed, dateRange },
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ error: 'Rapport non trouvé' });
        }
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const deleteConsumptionReport = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReport = await ConsumptionReport.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ error: 'Rapport non trouvé' });
        }
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export { createConsumptionReport, getConsumptionReports, getConsumptionReportById, updateConsumptionReport, deleteConsumptionReport, generateWeeklyConsumptionReport, validateConsomptionReport };
