import Passport from 'passport';
import PassportJwt from 'passport-jwt';
import Jwt, { decode } from 'jsonwebtoken';
import { Strategy } from 'passport-local';
import UserModel from '../models/user.model.js'

const SECRET = 'secret_key'


const AuthFields = {
    usernameField: 'email',
    passwordField: 'password'
};


const JwtOptions = {
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}


Passport.use( 'authenticate_user', new Strategy( AuthFields, async(email, password, done) =>{

    try {
        const user = await UserModel.findOne({ email: email }, 'firstname lastname email role password');
        if( !user ) return done(null, false, { logged: false, error: 'Wrong email or password' });
        if( !await user.validPassword(password) ) return done(null, false, { logged: false, error: 'Wrong email or password' });

        return done(null, user, { logged: 'true', item: user, jwt: getUserToken(user) });

    } catch(error) {
        return done(null, false, { error: error });
    }

}));


Passport.use( 'authorize_user', new PassportJwt.Strategy( JwtOptions, async(jwtPayload, done) =>{

    try {
        const user = await UserModel.findById( jwtPayload.sub );
        user.password = undefined;
        return done( null, user, { authorized: true } );

    } catch(error) {
        return done(error, false, { authorized: false, error: error })
    }

}));


function getUserToken( user ) {
    return Jwt.sign({
        role: user.role,
        sub: user.id
    }, SECRET);
};


function decodeJwt( jwt ) {
    return Jwt.decode( jwt );
}


export default decodeJwt;