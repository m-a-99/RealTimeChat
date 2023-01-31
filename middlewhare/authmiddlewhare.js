const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { checkRoomAccessMiddleWhare } = require('../controllers/apicontroller');

async function requireAuth(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        try {
            let decodedToken = await jwt.verify(token, 'secrit word');
            next();
        }
        catch (err) {
            console.log(err.message);
            res.redirect('/login');

        }
    }
    else {
        res.redirect("/login");
    }
}
async function requireRoomAccess(req, res, next) {
    checkRoomAccessMiddleWhare(req,res,next);    

}

async function check_user(req, res, next) {

    const token = req.cookies.jwt;
    if (token) {
        try {
            let decodedToken = await jwt.verify(token, 'secrit word');
            res.locals.user = decodedToken.id;
            //console.log(decodedToken.id)
            next();
        }
        catch (err) {
            console.log(err.message);
            res.locals.user = "not logedin";
            next();

        }
    }
    else {
        res.locals.user = "not logedin";
        next();

    }
}
async function check_user_socket(socket,next) {
    const token = cookie.parse(socket.handshake.auth.token)["jwt"];
    if (token) {
        try {
            let decodedToken = await jwt.verify(token, 'secrit word');
            socket.user_id = decodedToken.id;
            // socket.join(socket.handshake.auth.room)
            next();

        }
        catch (err) {
            console.log(err.message);
            socket.user_id = "not logined";
            next(new Error("not logined socket tocken"));

        }
    }
    else {
        
        socket.user_id = "not logined";
        next(new Error("invalid socket tocken"));

    }

}

module.exports.requireAuth = requireAuth;
module.exports.check_user = check_user;
module.exports.check_user_socket = check_user_socket;
module.exports.requireRoomAccess = requireRoomAccess;