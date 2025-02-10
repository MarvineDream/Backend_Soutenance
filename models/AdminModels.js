import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, 
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true },
},
{ timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;

