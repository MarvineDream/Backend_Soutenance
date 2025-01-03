import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {type: String, required: true},
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true }
}, 
{ timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

