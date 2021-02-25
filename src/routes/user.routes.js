import express from 'express';
import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import Passport from 'passport';


const router = express.Router();


router.post('/register', AuthMiddleware.registerAdmin, async(req, res) => {

    try {
        const data = req.body;
        const response = await UserController.register( data );
        res.status(200).send(response);
        
    } catch(error) {
        res.status(500).send({ registered: false, error: error });
    }
    
});


router.post('/login', (req, res) => {

    Passport.authenticate( 'authenticate_user', {session: false}, (error, user, message) =>{
        
        if(error || !user) {
            res.status(500).send(message);

        } else {
            res.status(200).send(message);
        }

    })(req, res);

});


router.put('/:id', AuthMiddleware.checkUserRole, async(req, res) => {

    try {
        const id = req.params.id
        const data = req.body;
        const response = await UserController.updateById( id, data );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({  updated: false, error: error });
    }

});


router.delete('/:id', AuthMiddleware.checkUserRole, async(req, res) => {

    try {
        const id = req.params.id
        const response = await UserController.deleteById( id );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({  updated: false, error: error });
    }

});


export default router;