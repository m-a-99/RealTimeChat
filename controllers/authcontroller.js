const user = require(__dirname + '/../models/user.js');
const jwt = require('jsonwebtoken');

const maxAge = 60 * 60 * 24 * 3;

function createtoken(id) {
    return jwt.sign({
        id
    }, 'secrit word', {
        expiresIn: maxAge
    });
}

async function get_signup(req, res) {
    res.render('signup_page.ejs');
}
async function get_login(req, res) {
    res.render('login.ejs');
}


async function post_signup(req, res) {
    const {
        user_name,
        user_email,
        user_type,
        user_password,
        conf_password
    } = req.body;
    let check = user.check(user_email, user_type, user_password, conf_password);
    let {
        email,
        type,
        password
    } = check
    let con_pass = check.conf_password;
    if (!(email[0] && type[0] && password[0] && con_pass[0])) {
        // res.status(400).render('home.ejs');

       res.status(400).send(JSON.stringify(check));

    } else {


        try {
            
            const r = await user.create(user_name, user_email, user_type, user_password);
            const token = createtoken(user_email);
            res.cookie('jwt', token, {
                maxAge: maxAge * 1000,
                sameSite: 'none',
                secure: true
            });
            res.redirect("/");
        } catch (err) {
            console.log(err.constraint);

           // res.status(400).render('home.ejs');
            res.status(400).send(JSON.stringify(err.constraint));


        }
    }
}



async function post_login(req, res) {
    let {
        user_email,
        user_password
    } = req.body;
    try {
        await user.login(user_email, user_password);
        const token = createtoken(user_email);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            sameSite: 'none', 
            secure: true
        });
        res.redirect('/');


    } catch (err) {
        console.log(err.message)
        res.send(err.message)
        

    }

}

module.exports.get_signup = get_signup;
module.exports.get_login = get_login;
module.exports.post_signup = post_signup;
module.exports.post_login = post_login;