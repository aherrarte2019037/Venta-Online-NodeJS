import express from 'express';
import ProductController from '../controllers/product.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();


router.get('/', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const response = await ProductController.getAll();
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/:id', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const id = req.params.id;
        const response = await ProductController.getById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/stock/:id', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const id = req.params.id;
        const response = await ProductController.getStockById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.post('/', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const data = req.body
        const response = await ProductController.add( data );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ added: false, error: error });
    }
    
});


router.put('/:id', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const id = req.params.id
        const data = req.body;
        const response = await ProductController.updateById( id, data );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ updated: false, error: error });
    }
    
});


router.delete('/:id', AuthMiddleware.authorizeAdmin, async(req, res) => {

    try {
        const id = req.params.id
        const response = await ProductController.deleteById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ deleted: false, error: error });
    }
    
});


export default router;