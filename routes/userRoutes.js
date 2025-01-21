import express from 'express';
import { loginUser} from '../controllers/userControllers.js';
import { getUserDistributions } from '../controllers/DistributionControllers.js';




const router = express.Router();


router.post('/login', loginUser);
router.get('/', getUserDistributions);




export default router;

