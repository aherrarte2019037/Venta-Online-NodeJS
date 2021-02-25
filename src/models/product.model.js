import mongoose from 'mongoose';


const ProductSchema = mongoose.Schema({
    name       : { type: String, required: [true, 'Name is required'], maxLength: 30 },
    price      : { type: Number, required: [true, 'Price is required'], min: 0 },
    description: { type: String, required: [true, 'Description is required'], maxLength: 100 },
    stock      : { type: String, default: 0,  min: 0 },
    category   : { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});


export default mongoose.model('Product', ProductSchema);