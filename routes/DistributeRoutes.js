import express from 'express';
import { createDistribution, deleteDistribution, getDistributionById, getUserDistributions, updateDistribution } from '../controllers/DistributionControllers.js';



const router = express.Router();


router.post('/', createDistribution);
router.get('/', getUserDistributions); 
router.get('/:id', getDistributionById); 
router.put('/:id', updateDistribution); 
router.delete('/:id', deleteDistribution); 

export default router;

