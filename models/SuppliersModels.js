import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
}, 
{ timestamps: true });

export default mongoose.model('supplier', supplierSchema);