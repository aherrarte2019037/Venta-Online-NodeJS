import connect from './db.js';
import express from 'express';
import AppRoutes from './routes/app.routes.js';
import ProductoRoutes from './routes/product.routes.js';
import CategoryRoutes from './routes/category.routes.js';
import UserRoutes from './routes/user.routes.js';
import Passport from 'passport';
import UserController from './controllers/user.controller.js';
import './services/auth.service.js';


//Iniciar Autenticación
Passport.initialize();


//Variables
const app = express();
const PORT = 3000;


//Configurar Servidor
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );


//Conectar A DB
connect();


//Rutas
app.use( '/api', AppRoutes );
app.use( '/api/product', ProductoRoutes );
app.use( '/api/user', UserRoutes );
app.use( '/api/category', CategoryRoutes );


//Iniciar Servidor
app.listen( PORT , () => {
    console.log(`Servidor en el puerto ${PORT}`);
    UserController.createAdmin();
});