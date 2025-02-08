import mongoose from 'mongoose';



const agencySchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
}, 
{ timestamps: true });

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
