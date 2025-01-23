import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true}
},
{ timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;

