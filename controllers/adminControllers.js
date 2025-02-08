import User from '../models/UsersModels.js';
import Admin from '../models/AdminModels.js';
import { generateToken } from '../config/jwt.js';
import Agency from '../models/AgencyModels.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator'; 




const registerAdmin = async (req, res) => {
    const { adminName, email, password, role } = req.body;
    console.log(req.body);
    
    try {
        const existingAdmin = await Admin.findOne({ $or: [{ adminName }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Nom ou email déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ adminName, email, password: hashedPassword, role });
        await newAdmin.save();

        res.status(201).json({ message: 'Administrateur créé avec succès.', admin: newAdmin });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Erreur lors de la création de l\'administrateur.', error: error.message });
    }
};

const loginAdmin = async (req, res) => {
    const { adminName, password } = req.body;
    try {
        const admin = await Admin.findOne({ adminName });
        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = generateToken(admin._id);
            res.status(200).json({ token, admin });
        } else {
            res.status(401).json({ message: 'Identifiants invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUserForAgency = async (req, res) => {
    // Validation des champs requis
    await body('username').notEmpty().withMessage('Nom d’utilisateur requis.').run(req);
    await body('email').isEmail().withMessage('Email invalide.').run(req);
    await body('role').notEmpty().withMessage('Rôle requis.').run(req);
    await body('agencyId').notEmpty().withMessage('ID de l’agence requis.').run(req);
    await body('password').notEmpty().withMessage('Mot de passe requis.').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, role, agencyId, password } = req.body;

    console.log('Première Données reçues:', req.body);

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Le nom d'utilisateur ou l'email existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role, agencyId });

        console.log('Seconde Données reçues:', newUser);

        await newUser.save();
        await Agency.findByIdAndUpdate(agencyId, { $push: { users: newUser._id } });

        const resetToken = crypto.randomBytes(32).toString('hex');
        newUser.resetPasswordToken = resetToken;
        newUser.resetPasswordExpires = Date.now() + 3600000;
        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const resetUrl = `https://backend-soutenance-1.onrender.com/api/admin/create-user/reset-password/${resetToken}`;

        const mailOptions = {
            from: 'bamboo',
            to: newUser.email,
            subject: 'Informations de connexion',
            text: `Bonjour ${username},\n\nVoici vos informations de connexion :\nNom : ${username}\nEmail : ${email}\nAgence : ${agencyId}\n\nLien pour réinitialiser votre mot de passe : ${resetUrl}\n\nCordialement,\nL'équipe bamboo Assur`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role, agency } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, password, role, agency }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(updatedUser);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        // Envoi d'un message de confirmation après la suppression
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export { registerAdmin, loginAdmin, createUserForAgency, getUserById, getAllUsers, updateUser, deleteUser };
