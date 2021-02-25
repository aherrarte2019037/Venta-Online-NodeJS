import express from 'express';
import CategoryController from '../controllers/category.controller.js'

const router = express.Router();


router.get('/', (req, res) => {

    res.status(200).send('Category Route');
    
});


export default router;