import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI; 
        if (!uri) {
            throw new Error('La chaîne de connexion à MongoDB est manquante dans les variables d\'environnement.');
        }
        console.log('Tentative de connexion à MongoDB:'); 
        await mongoose.connect(uri);
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
    }
};
