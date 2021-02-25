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


export default router;