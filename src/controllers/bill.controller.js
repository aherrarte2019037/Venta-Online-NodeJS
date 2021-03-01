import BillModel from '../models/bill.model.js';
import UserModel from '../models/user.model.js';
import ProductController from '../controllers/product.controller.js';
import { format } from 'date-fns';


export default class BillController {

    static async getAll() {

        try {
            const data = UserModel.find({ role: 'client' }).select('-shopping_cart').populate('bills');
            if( !data || (await data).length === 0 ) return { error: 'Data not found' };

            return data;

        } catch(error) {
            return { error: error };
        }

    }


    static async getById( id ) {

        try {
            const data = BillModel.findById( id ).populate('products._id');
            if( !data || (await data).length === 0 ) return { error: 'Data not found' };

            return data;

        } catch(error) {
            return { error: error };
        }

    }


    static async add( userId ) {

        try {
            const user = await UserModel.findById( userId );
            if( !user ) return { billAdded: false, error: 'Invalid id or user not found' };
            if( user.shopping_cart.total === 0 ) return { billAdded: false, error: 'Empty shopping cart' };

            for ( const product of user.shopping_cart.products ) {
               const productUpdated = await ProductController.updateSales( product.id, product.quantity );
               if( !productUpdated.succeed ) return { billAdded: false, error: { message: 'Product out of stock', quantity: product.quantity, stock: productUpdated.item.stock, product: productUpdated.item.name, id: productUpdated.item.id } }
            }

            const bill = await BillModel.create({ date: format(new Date(),'dd-MM-uuuu hh:mm:ss:a'), total: user.shopping_cart.total, products: user.shopping_cart.products });
            const data = await UserModel.findByIdAndUpdate( userId, { $push: { bills: {_id: bill.id} }, 'shopping_cart.total': 0, 'shopping_cart.products': [] } ).populate('bills._id');

            return { billAdded: true, item: data };

        } catch(error) {
            res.status(500).send({ billAdded: false, error: error });
        }

    }

}