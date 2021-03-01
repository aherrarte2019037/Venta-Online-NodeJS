import mongoose from 'mongoose';
import { format } from 'date-fns';


const BillSchema = mongoose.Schema({
    date    : { type: String, required: [true, 'Date is required'] },
    total   : { type: Number, required: [true, 'Total is required'], min: 0 },
    products: [{
        _id     : { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, min: 1, default: 1 }
    }]
});


export default mongoose.model('Bill', BillSchema);