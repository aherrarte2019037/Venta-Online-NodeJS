import Passport from 'passport';
import UserModel from '../models/user.model.js'


export default class AuthMiddleware {

    static registerAdmin( req, res, next ) {

        if( req.body.role === 'admin' ) {
            Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

                if(error || !user || user.role !== 'admin') {
                    res.status(500).send('Unauthorized');
        
                } else {
                    next();
                }
        
            })(req, res, next);

        } else {
            next();
        }

    }


    static authorizeAdmin( req, res, next ) {

        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

            if( error || !user || user.role !== 'admin' ) {
                res.status(500).send('Unauthorized');
        
            } else {
                next();
            }
        
        })(req, res, next);

    }


    static authorizeClient( req, res, next ) {

        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

            if( error || !user || user.role !== 'client' ) {
                res.status(500).send('Unauthorized');
        
            } else {
                req.user = user;
                next();
            }
        
        })(req, res, next);

    }


    static async checkUserRole( req, res, next ) {

        const checkUser = await UserModel.findById( req.params.id );
        if( !checkUser ) return next();

        if( checkUser.role === 'client' ) {

            if( req.body.role === 'admin' || req.body.role === 'client' ) {

                Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{
                    
                    if(error || !user || user.role !== 'admin') {
                        res.status(500).send('Unauthorized');
            
                    } else {
                        next();
                    }
            
                })(req, res, next);
    
            } else {
                Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

                    if( error || !user ) {
                        res.status(500).send('Unauthorized');
                
                    } else {
                        next();
                    }
                
                })(req, res, next);
            }

        } else {
            res.status(500).send('Unauthorized');
        }

        

    }


    static authorizeUser( req, res, next ) {

        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

            if( error || !user ) {
                res.status(500).send('Unauthorized');
        
            } else {
                req.user = user;
                next();
            }
        
        })(req, res, next);

    }

}