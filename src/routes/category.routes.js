import express from 'express';
import CategoryController from '../controllers/category.controller.js'

const router = express.Router();


router.get('/', async(req, res) => {

    try {
        const response = await CategoryController.getAll();
        res.status(200).send(response);

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.get('/:id', async(req, res) => {

    try {
        const id = req.params.id;
        const response = await CategoryController.getById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
    
});


router.post('/', async(req, res) => {

    try {
        const data = req.body
        const response = await CategoryController.add( data );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ added: false, error: error });
    }
    
});


router.put('/:id', async(req, res) => {

    try {
        const id = req.params.id
        const data = req.body;
        const response = await CategoryController.updateById( id, data );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ updated: false, error: error });
    }
    
});


router.delete('/:id', async(req, res) => {

    try {
        const id = req.params.id
        const response = await CategoryController.deleteById( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send({ deleted: false, error: error });
    }
    
});


export default router;