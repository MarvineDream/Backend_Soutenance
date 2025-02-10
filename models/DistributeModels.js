import mongoose from 'mongoose';

const distributeSchema = new mongoose.Schema({
    code_produit: { type: String, required: true },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    quantite: { type: Number, required: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, 
    destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true }, 
    date: { type: Date, default: Date.now } 
}, 
{ timestamps: true });

export default mongoose.model('Distribute', distributeSchema);
