import mongoose from 'mongoose';


function connect() {
    
    const USER = 'root';
    const PASS = 'root';
    const PORT = 27017;
    const DB = 'venta_online';

    mongoose.Promise = global.Promise;
    mongoose.set( 'returnOriginal', false );
    mongoose.set( 'useFindAndModify', false );
    mongoose.set( 'useCreateIndex', true );
    mongoose.set( 'useNewUrlParser', true );
    mongoose.set( 'useUnifiedTopology', true );

    mongoose.connect( `mongodb://${USER}:${PASS}@localhost:${PORT}/${DB}?authSource=admin` )
    .then( () => console.log('Conexión Exitosa') )
    .catch( (error) => console.log(`Conexión Fallida: ${error}`) );
    
}


export default connect;