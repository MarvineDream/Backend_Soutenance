import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    code_produit: { type: String, required: true },
    produit: { type: String, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
    price: { type: Number, required: true }, 
    isFree: { type: Boolean, default: false }, 
    quantity: { type: Number, default: 0 },
    minStockLevel: { type: Number }
}, 
{ timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;








