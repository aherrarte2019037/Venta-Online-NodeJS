import CategoryModel from '../models/category.model.js';
import ProductController from '../controllers/product.controller.js';
import mongoose from 'mongoose';


export default class CategoryController {

    static defaultCategory;


    static async createDefaultCategory() {
       this.defaultCategory = await CategoryModel.findOne({ $or: [{ name: 'default' }, { name: 'Default' }] });
       if( !this.defaultCategory ) this.defaultCategory = await CategoryModel.create({ name: 'Default' });
    }
    

    static async getAll() {

        try {
            const data = await CategoryModel.find();
            if( !data || data.length === 0 ) return { error: 'Empty or not found data' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }


    static async getById( id ) {

        try {
            const data = await CategoryModel.findById( id );
            if( !data || data.length === 0 ) return { error: 'Id invalid or not found' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }


    static async add( addData ) {

        try {
            const data = await CategoryModel.create({ ...addData });
            return { added: true, item: data };

        } catch(error) {
            return { added: false, error: error?.message };
        }

    }


    static async updateById( id, updateData ) {

        try {
            const data = await CategoryModel.findByIdAndUpdate( id, {...updateData} );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };

            return { updated: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async deleteById( id ) {

        try {
            const data = await CategoryModel.findByIdAndDelete( id );
            if( !data ) return { deleted: false, error: 'Id invalid or not found' };

            await ProductController.updateToDefault( id );

            return { deleted: true, item: data };

        } catch(error) {
            return { deleted: false, error: error };
        }

    }


    static async existsCategory( data ) {

        try {
            const id = mongoose.Types.ObjectId( mongoose.isValidObjectId(data)? data:'000000000000' );
            const category = await CategoryModel.findOne({ $or: [{name: new RegExp(`^${data}$`, 'i')}, {_id: id}] });

            if( !category ) return false;

            return category;

        } catch (error) {
            return false;
        }

    }

}