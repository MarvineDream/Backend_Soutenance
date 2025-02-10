import express from 'express';
import { createAgency, deleteAgency, getAgencies, getAgencyById, updateAgency } from '../controllers/AgencyControllers.js';


const router = express.Router();


router.post('/create_agence', createAgency);
router.get('/', getAgencies);
router.get('/:id', getAgencyById);
router.put('/:id', updateAgency);
router.delete('/:id', deleteAgency);

export default router;