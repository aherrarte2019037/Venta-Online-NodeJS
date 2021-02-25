import ProductModel from '../models/product.model.js';


export default class ProductController {

    static async getAll() {

        try {
            const data = await ProductModel.find();
            if( !data || data.length === 0 ) return { error: 'Empty or not found data' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }


    static async getById( id ) {

        try {
            const data = await ProductModel.findById( id );
            if( !data || data.length === 0 ) return { error: 'Id invalid or not found' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }


    static async add( addData ) {

        try {
            const productRepeat = await ProductModel.findOne({ name: addData.name });
            if( productRepeat ) return { added: false, error: 'Product already exists' };

            const data = await ProductModel.create({ ...addData });

            return { added: true, item: data };

        } catch(error) {
            return { added: false, error: error };
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

}