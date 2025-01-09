import User from '../models/UsersModels.js';
import Admin from '../models/AdminModels.js';
import { generateToken } from '../config/jwt.js';
import Agency from '../models/AgencyModels.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';






 const registerAdmin = async (req, res) => {
    const { adminName, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ adminName, password: hashedPassword, role });
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    const { username, email, role, agencyId, password } = req.body; 

    // Log des données d'entrée
    console.log('Premiere Données reçues:', req.body);

    try {
        if (!username || !email || !role || !agencyId || !password) { 
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "l'email déjà existant"  });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role, 
            agencyId  
        });  console.log('Seconde Données reçues:', newUser);

        

        await newUser.save();
        await Agency.findByIdAndUpdate(agencyId, { $push: { users: newUser._id } });

        const resetToken = crypto.randomBytes(32).toString('hex'); 
        newUser.resetPasswordToken = resetToken;
        newUser.resetPasswordExpires = Date.now() + 3600000; 
        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'leskalpel@gmail.com', 
                pass: 'foin tbpe ryrn ltdc' 
            }
        });

        const resetUrl = `http://localhost:3003/api/admin/create-user/reset-password/${resetToken}`; 

        
        if (!newUser.email) {
            return res.status(400).json({ error: 'Adresse e-mail non définie pour l\'utilisateur.' });
        }

        const mailOptions = {
            from: '', 
            to: newUser.email,
            subject: 'Informations de connexion',
            text: `Bonjour ${username}, l'administrateur de l'application bamboo assur Stock vient de créer votre compte\n\nVoici un rappel de vos informations\n\n votre nom ${username},\n\nvotre email ${email}\n\nvotre mot de passe est ${password}, vous etes responsable de l'agence ${agencyId}. \n\n Voici le lien pour réinitialiser votre mot de passe:\n\n${resetUrl}\n\nVeuillez changer votre mot de passe après la première connexion.\n\nCordialement,\nL'équipe bamboo Assur`
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
        res.status(204).send(); 
    } catch (error) {
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export { registerAdmin, loginAdmin, createUserForAgency, getUserById, getAllUsers, updateUser, deleteUser };