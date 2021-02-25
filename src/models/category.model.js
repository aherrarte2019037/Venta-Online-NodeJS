import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';  


const CategorySchema = mongoose.Schema({
    name       : { type: String, required: [true, 'Name is required'], maxLength: 30, unique: true, uniqueCaseInsensitive: true }
});


CategorySchema.plugin( uniqueValidator, { message: '{PATH} already exists.' } );


export default mongoose.model('Category', CategorySchema);