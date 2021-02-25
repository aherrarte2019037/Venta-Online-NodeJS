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


    static async add( addData ) {

        try {
            const data = await ProductModel.find();
            if( !data || data.length === 0 ) return { error: 'Empty or not found data' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }

}