const database = require('./database.js');
const bcrypt = require('bcrypt');
async function create(username, email, type, password) {
    try {
        let salt =  bcrypt.genSalt();
        let hpassword = await bcrypt.hash(password, parseInt(salt));
        const client = await database.getclient();
        const result = await client.query("insert into users(username,useremail,userpassword,usertype) values($1,$2,$3,$4);", [username, email, hpassword, type]);
        client.release();
        return result;
    }

    catch (e) { console.log(e) }
}

function check(email, type, password, conf_password) {
    let ob = {
        email: [true],
        type: [true],
        password: [true],
        conf_password: [true]
    }
    if (!(email.includes('@') && email.includes('.'))) {
        ob.email = [false, 'this is a wrong email'];
    }
    if (!(type === "Doctor" || type === "Patient")) {
        ob.type = [false, "wrong type"];
    }
    if (!(password.length >= 6)) {
        ob.password = [false, 'password must be at least 6 character or digit'];
    }
    if (!(password === conf_password)) {
        ob.conf_password = [false, 'password didnt match'];
    }
    return ob

}

async function login(email, password) {
    const client = await database.getclient();
    let result = await client.query("select * from users where useremail =$1;", [email]);
    if (!result.rowCount)
        throw Error('this email is not exist');
    else {
        let check_password = await bcrypt.compare(password, result.rows[0].userpassword);
        if (!check_password) {
            throw Error('incorrect password')
        }
        else {

        }
    }

    client.release();
}




async function insert_message(id, body, sendtime, senderid, roomid) {
    try {
    const client = await database.getclient();
        let result = await client.query("insert into massegebox(id,body,sendtime,senderid,roomid)  values($1,$2,$3,$4,$5);", [id, body, sendtime,senderid,roomid]);
    
    client.release();
}
    catch (e) { console.log(e) }
}

module.exports.check = check;
module.exports.create = create;
module.exports.login = login;
module.exports.insert_message = insert_message;
