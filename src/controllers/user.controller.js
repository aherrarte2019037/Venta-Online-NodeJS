import UserModel from '../models/user.model.js';

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

}