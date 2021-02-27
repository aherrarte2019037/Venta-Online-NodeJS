import mongoose from 'mongoose';


const BillSchema = mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], maxLength: 30, unique: true }
});


export default mongoose.model('Bill', BillSchema);