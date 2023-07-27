const expressJwt = require('express-jwt');

const authJwt = ()=>{
    const secret = process.env.JWT_SECRET_KEY;
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked : isRevoked, //verify if user is Admin
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']}, //regular expression to handle images api path
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']}, //regular expression to handle anything after product api path
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']}, //regular expression to handle anything after category api path
            `${api}/users/login`,
            `${api}/users/register`,
        ] //apis to be excluded
    }) 
}

const isRevoked = async( req, payload, done) =>{
    if(!payload.isAdmin){
        done(null, true)
    }
    done();
}

module.exports = authJwt