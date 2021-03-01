import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import BillController from '../controllers/bill.controller.js';
import mongoose from 'mongoose';


export default class UserController {

    static async createAdmin() {

        const userRepeat = await UserModel.findOne({ firstname: 'Admin', lastname: 'Admin', role: 'admin', email: 'admin@admin.com.gt' });
        if( !userRepeat ) await UserModel.create({ firstname: "Admin", lastname: "Admin", age: 18, role: "admin", email: "admin@admin.com.gt", password: "123456" });
    
    }


    static async register( data ) {

        const user = new UserModel({ ...data });

        try {
            await user.save();
            const response = {...user}._doc
            delete response.password
            
            return { registered: true, item: response };

        } catch(error) {
            return { registered: false, error: error.message };
        }  
        
    }


    static async updateById( id, updateData ) { 

        try {
            const data = await UserModel.findByIdAndUpdate( id, updateData );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };
            return { updated: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async deleteById( id ) { 

        try {
            const data = await UserModel.findByIdAndDelete( id );
            if( !data ) return { deleted: false, error: 'Id invalid or not found' };
            return { deleted: true, item: data };

        } catch(error) {
            return { deleted: false, error: error };
        }

    }


    static async addProduct( userId, product, quantity = 1 ) {

        try {
            const id = mongoose.Types.ObjectId( mongoose.isValidObjectId(product)? product:'000000000000' );
            const productExists = await ProductModel.findOne({ $or: [{name: new RegExp(`^${product}$`, 'i')}, {_id: id}] });
            if( !product || !productExists ) return { productAdded: false, error: 'Product not found' };

            if( quantity <= 0 || isNaN(quantity) ) return { productAdded: false, error: 'Cuantity invalid' };

            if( productExists.stock <= 0 ) return { productAdded: false, error: 'Product out of stock' }

            const user = await UserModel.findById( userId );
            const includes = user.shopping_cart.products.some( product => productExists.id === product.id );

            if( includes ){
                const data = await UserModel.findOneAndUpdate( { 'shopping_cart.products._id': productExists._id, _id: userId }, { $inc: { 'shopping_cart.products.$.quantity': quantity } } ).populate('shopping_cart.products._id', 'name price');
                const updatedData = await this.updateCartTotals( userId, data.shopping_cart.products );
                return { productAdded: true, shopping_cart: updatedData.shopping_cart };
            }

            const data = await UserModel.findByIdAndUpdate( userId, { $push: {'shopping_cart.products': { _id: productExists.id, quantity: quantity }} } ).populate('shopping_cart.products._id', 'name price');
            if( !data ) return { productAdded: false, error: 'Something went wrong' };    
            const updatedData = await this.updateCartTotals( userId, data.shopping_cart.products );

            return { productAdded: true, shopping_cart: updatedData.shopping_cart };

        } catch(error) {
            return res.status(200).send({ productAdded: false, error: error });
        }

    }


    static async updateCartTotals( id, products ) {

        let total = 0;
        products.forEach( p => {
            total = total + (p.quantity*p._id.price);
        });

        return await UserModel.findByIdAndUpdate( id, { 'shopping_cart.total': total } ).populate('shopping_cart.products._id', 'name price');

    }


    static async deleteProductById( userId, product, quantity = 1 ) { 

        try {
            const id = mongoose.Types.ObjectId( mongoose.isValidObjectId(product)? product:'000000000000' );
            const productExists = await ProductModel.findOne({ $or: [{name: new RegExp(`^${product}$`, 'i')}, {_id: id}] });
            if( !product || !productExists ) return { productAdded: false, error: 'Product not found' };

            if( quantity <= 0 || isNaN(quantity) ) return { productAdded: false, error: 'Cuantity invalid' };

            const user = await UserModel.findById( userId );
            const includes = user.shopping_cart.products.find( p => productExists.id === p.id );


            if( includes.quantity > 1 ){
                const data = await UserModel.findOneAndUpdate( { 'shopping_cart.products._id': productExists._id, _id: userId }, { $inc: { 'shopping_cart.products.$.quantity': quantity*-1 } } ).populate('shopping_cart.products._id', 'name price')
                const updatedData = await this.updateCartTotals( userId, data.shopping_cart.products );
                return { productDeleted: true, shopping_cart: updatedData.shopping_cart };
            }

            const data = await UserModel.findByIdAndUpdate( userId, { $pull: {'shopping_cart.products': { _id: productExists.id }} } ).populate('shopping_cart.products._id', 'name price');
            if( !data ) return { productAdded: false, error: 'Something went wrong' };    
            const updatedData = await this.updateCartTotals( userId, data.shopping_cart.products );

            return { productDeleted: true, shopping_cart: updatedData.shopping_cart };
            

        } catch(error) {
            return { deleted: false, error: error };
        }

    }


    static async getBills( userId ) {

        try {
            const data = await UserModel.findById( userId, { shopping_cart: 0, role: 0, _id: 0, __v: 0 } ).populate('bills._id');
            if( !data ) return 'Data not found';

            return data;
            
        } catch (error) {
            return { error: error }
        }

    }


    static async getBillById( userId, billId ) {

        try {
            const data = await UserModel.findOne( { _id: userId, 'bills._id': billId }, { 'bills.$': 1 } );
            if( !data || !billId ) return { error: 'Data not found'};

            const bill = await BillController.getById( data.bills[0]._id );

            return bill;
            
        } catch (error) {
            return { error: error }
        }

    }

}