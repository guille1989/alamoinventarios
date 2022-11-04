var jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    let token = req.get('Authorization')
    jwt.verify(token, 'password', (err, decode) => {
        if(err){
            return res.status(401).json({
                err
            })
        }
        /*res.json({
            token: token,
            msj: 'validacion token Ok',
            user: decode.user})*/
        req.user = decode.user;
        next();
    })
}

module.exports = verificarToken;