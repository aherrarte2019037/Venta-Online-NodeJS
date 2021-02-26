import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


const ProductSchema = mongoose.Schema({
    name       : { type: String, required: [true, 'Name is required'], maxLength: 30, unique: true },
    price      : { type: Number, required: [true, 'Price is required'], min: 0 },
    description: { type: String, required: [true, 'Description is required'], maxLength: 100 },
    stock      : { type: Number, default: 0,  min: 0 },
    category   : { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});


ProductSchema.plugin( uniqueValidator, { message: 'Product already exists.' } );


export default mongoose.model('Product', ProductSchema);