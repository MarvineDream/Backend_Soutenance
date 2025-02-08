import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectToDatabase} from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import supplierRoutes from './routes/SupplierRoutes.js';
import StockmovementRoutes from './routes/StockmovementRoutes.js'
import productRoutes from './routes/ProductRoutes.js';
import ConsumptionReportsRoutes from './routes/consumptionReportsRoutes.js'
import DistributeRoutes from './routes/DistributeRoutes.js'
import AgencyRoutes from './routes/AgencyRoutes.js';
import CategoryRoutes from './routes/CategoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';














dotenv.config();
const app = express()
const PORT = process.env.PORT 



connectToDatabase();

// Middleware pour permettre l'accès à l'API (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '1800');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    // Gérer les requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Réponse vide pour les requêtes OPTIONS
    }

    next();
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Routes

app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/Fournisseur', supplierRoutes);
app.use('/Stock', StockmovementRoutes);
app.use('/Produit', productRoutes);
app.use('/distribuer', DistributeRoutes);
app.use('/consumption-reports', ConsumptionReportsRoutes);
app.use('/weekly-consumption-report', ConsumptionReportsRoutes);
app.use('/Agence', AgencyRoutes);
app.use('/categorie', CategoryRoutes);






app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});