import express from 'express';
import BillController from '../controllers/bill.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import ProductController from '../controllers/product.controller.js';


const router = express.Router();


router.get('/', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const response = await BillController.getAll();
        res.status(200).send(response);

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/:id', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const id = req.params.id; 
        const response = await BillController.getById( id );
        res.status(200).send(response);

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/verify/stock', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const response = await ProductController.getStock();
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/verify/best-seller', AuthMiddleware.authorizeUser, async(req, res) => {

    try {
        const response = await ProductController.getBestSeller();
        res.status(200).send(response);

    } catch (error) {
        res.status(500).send(error)
    }

});


router.post('/:userId', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const id = req.params.userId; 
        const response = await BillController.add( id );

        res.status(200).send(response);

    } catch (error) {
        res.status(500).send({ billAdded: false, error: error });
    }

});


export default router;