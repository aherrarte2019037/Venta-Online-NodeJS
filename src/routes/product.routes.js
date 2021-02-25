import express from 'express';
import ProductController from '../controllers/product.controller.js';


const router = express.Router();


router.get('/', async(req, res) => {

    try {
        
        const response = await ProductController.getAll();
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/:id', async(req, res) => {

    try {
        const id = req.params.id;
        const response = await ProductController.getById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.post('/', async(req, res) => {

    try {
        const data = req.body
        const response = await ProductController.add( data );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ added: false, error: error });
    }
    
});


router.put('/:id', async(req, res) => {

    try {
        const id = req.params.id
        const data = req.params.id;
        const response = await ProductController.updateById( id, data );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ updated: false, error: error });
    }
    
});


router.delete('/:id', async(req, res) => {

    try {
        const id = req.params.id
        const response = await ProductController.deleteById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ deleted: false, error: error });
    }
    
});


export default router;