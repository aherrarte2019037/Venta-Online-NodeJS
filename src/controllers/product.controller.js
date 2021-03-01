import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import CategoryController from '../controllers/category.controller.js';
import mongoose from 'mongoose';


export default class ProductController {

    static async getAll() {

        try {
            const data = await ProductModel.find().populate('category', {_id: 0, __v: 0});
            if( !data || data.length === 0 ) return { error: 'Empty or not found data' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }


    static async getOne( product ) {

        try {
            const id = mongoose.Types.ObjectId( mongoose.isValidObjectId(product)? product:'000000000000' );
            const productExists = await ProductModel.findOne({ $or: [{name: new RegExp(`^${product}$`, 'i')}, {_id: id}] }).populate('category', {_id: 0, __v: 0});
            if( !product || !productExists ) return { error: 'Product not found' };
            
            return productExists;

        } catch(error) {
            return { error: error }
        }

    }


    static async getByCategory( category ) {

        try {
            const id = mongoose.Types.ObjectId( mongoose.isValidObjectId(category)? category:'000000000000' );
            const categoryExists = await CategoryModel.findOne({ $or: [{name: new RegExp(`^${category}$`, 'i')}, {_id: id}] });
            if( !category || !categoryExists ) return { error: 'Category not found' };
            
            const products = await ProductModel.find({ category: categoryExists.id }).populate('category', { _id: 0, __v: 0 })
            if( !products || products.length === 0 ) return { error: 'No products were found in this category' };

            return products;

        } catch(error) {
            return { error: error }
        }

    }


    static async getStockById( id ) {

        try {
            
            const data = await ProductModel.findById( id );
            if( !data || data.length === 0 ) return { error: 'Id invalid or not found' };

            if( data.stock <= 0 ) return { available: false, stock: data.stock, product: data.name, price: data.price };

            return { available: true, stock: data.stock, product: data.name, price: data.price };

        } catch(error) {
            return { error: error }
        }

    }


    static async getStock() {

        try {
            
            const data = await ProductModel.find({ stock: 0 });
            if( !data || data.length === 0 ) return { error: 'Data not found' };

            return data;

        } catch(error) {
            return { error: error }
        }

    }


    static async add( addData ) {

        try {
            const existsCategory = await CategoryController.existsCategory( addData.category );
            if( !existsCategory && addData.category ) return { added: false, error: 'Category doesn´t exist' };

            if( !existsCategory && !addData.category ) addData.category = CategoryController.defaultCategory;

            if( existsCategory ) addData.category = existsCategory;

            const data = await ProductModel.create({ ...addData });
            
            return { added: true, item: data };

        } catch(error) {
            return { added: false, error: error?.message };
        }

    }


    static async updateById( id, updateData ) {

        try {
            const data = await ProductModel.findByIdAndUpdate( id, {...updateData} );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };

            return { updated: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async deleteById( id ) {

        try {
            const data = await ProductModel.findByIdAndDelete( id );
            if( !data ) return { deleted: false, error: 'Id invalid or not found' };

            return { deleted: true, item: data };

        } catch(error) {
            return { deleted: false, error: error };
        }

    }


    static async updateToDefault( id ) {

        await ProductModel.updateMany({ category: id}, { category: CategoryController.defaultCategory });

    }


    static async updateSales( id, sales ) {

        await ProductModel.findByIdAndUpdate( id, { $inc: { sales: sales } } );

    }


    static async getBestSeller() {

        try {
            const data = ProductModel.find().sort({ sales: -1 }).limit(5)
            if( !data || (await data).length === 0 ) return { error: 'Data not found' };

            return data;

        } catch(error) {
            return { error: error };
        }

    }

}