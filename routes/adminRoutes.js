import express from 'express';
import { deleteUser, getAllUsers, getUserById, loginAdmin, registerAdmin, updateUser } from '../controllers/adminControllers.js';
//import { authenticate } from '../middleware/auth.js';
import { createUserForAgency } from '../controllers/adminControllers.js';

const router = express.Router();

router.post('/Register', registerAdmin),
router.post('/Login', loginAdmin);
router.post('/create-user', createUserForAgency);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;
