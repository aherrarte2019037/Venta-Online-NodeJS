import mongoose from 'mongoose';


const CategorySchema = mongoose.Schema({
    name       : { type: String, required: [true, 'Name is required'], maxLength: 30 }
});


export default mongoose.model('Category', CategorySchema);