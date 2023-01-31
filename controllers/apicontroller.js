const database = require('../models/database.js');
var formidable = require('formidable');
const fs = require('fs')
async function getmessages(id, page) {
    let client = await database.getclient();
    let r = await client.query("select * from (select u.userphoto as sender_photo , m.senderid as sender_id ,u.username as sender_name ,m.roomid as room_id,m.id as massage_id, m.body ,m.sendtime as send_time ,m.indx from massegebox as m  join users as u on(m.senderid =u.useremail) where m.roomid = $1 order by m.indx desc offset $2 limit $3)as mmm order by mmm.indx;", [id, (page * 10), 10])
    client.release();
    return r.rows;
}

// async function getcontacts(id) {
//     let client = await database.getclient();
//     let r = await client.query("select u.useremail as partner_id,u.username as partner_name,r.roomid as room_id , r.roomname as room_name from users as u join userrooms as ur ON(u.useremail=ur.useremail) join rooms as r on(ur.roomid =r.roomid) where u.useremail !=$1 and ur.roomid in(select roomid from userrooms u2 where u2.useremail =$1);", [id])
//     client.release();
//     return r.rows;
// }

async function getcontacts(id) {
    let client = await database.getclient();
    let r = await claient.query(
        `select rm.indx as "key" ,rm.roomid as room_id,
       CASE rm.roomtype WHEN '2+' THEN rm.roomname 
              WHEN '2' THEN (select u.username from rooms r join userrooms ur using (roomid)join users u using (useremail) where r.roomid=rm.roomid and u.useremail!=$1)
              ELSE 'other'
       end as room_name ,
       CASE rm.roomtype WHEN '2+' THEN rm.roomphoto 
              WHEN '2' THEN (select u.userphoto from rooms r join userrooms ur using (roomid)join users u using(useremail) where r.roomid=rm.roomid and u.useremail!=$1)
              ELSE 'other'
       end as room_photo
       FROM rooms rm join userrooms u2 using(roomid) where u2.useremail =$1;`
        , [id])
    client.release();
    return r.rows;
}


async function getmyinfo(id) {
    const client = await database.getclient();
    let r = await client.query("select u.useremail ,u.username ,u.userphoto ,u.usertype from users u where u.useremail =$1", [id])
    client.release()
    return r.rows;
}
async function checkroom(id) {
    let client = await database.getclient();
    let r = await client.query("select * from rooms where rooms.roomid =$1", [id])
    client.release();
    return r.rowCount;
}
async function checkroomAccess(roomid, myid) {
    let client = await database.getclient();
    let r = await client.query("select *from userrooms u2 where u2.roomid =$1 and u2.useremail =$2;", [roomid, myid])
    client.release();
    return r.rowCount;
}

async function get_not_contact_users(me) {
    let client = await database.getclient();
    let r = await client.query(`select ur.indx as "key" ,ur.useremail as contact_id ,ur.username as contact_name ,ur.usertype as contact_type,ur.userphoto as contact_photo from users as ur where ur.useremail !=$1 and ur.useremail not in( select  u2.useremail from rooms rm join userrooms u using(roomid) join userrooms u2 on(u.useremail !=u2.useremail ) where rm.roomtype ='2' and u.roomid =u2.roomid and u.useremail =$1);`, [me])
    client.release();
    return r.rows;
}

async function create_room(firstuser, seconduser) {
    try {
        let id = "" + Math.floor(Math.random() * Date.now());
        const client = await database.getclient();
        let result = await client.query("insert into rooms(roomid,roomname,roomtype) values($1,'','2');", [id]);
        let result2 = await client.query("insert into userrooms(useremail,roomid) values($2, $1);", [id, firstuser]);
        let result3 = await client.query("insert into userrooms(useremail,roomid) values($2, $1);", [id, seconduser]);

        client.release();
        return id;
    }
    catch (e) { console.log(e) }

}

async function updatemyphoto(userid, path) {
    try {
        const client = await database.getclient();
        let r=await client.query("update users set userphoto =$2 where useremail =$1;", [userid, path])
        client.release();
    }
    catch (e) { console.log(e) }

}

async function updatemyname(userid, name) {
    try {
        const client = await database.getclient();
        let r = await client.query("update users set username =$2 where useremail =$1;", [userid,name])
        client.release();
    }
    catch (e) { console.log(e) }

}

async function get_room_info(roomid, myid) {
    const client = await database.getclient();
    let result = await client.query(`select r.roomid as room_id,
CASE r.roomtype WHEN '2+' THEN r.roomname 
              WHEN '2' THEN u.username 
              ELSE 'other'
       end as room_name ,
       CASE r.roomtype WHEN '2+' THEN r.roomphoto 
              WHEN '2' THEN  u.userphoto 
              ELSE 'other'
       end as room_photo
  ,u.lastseen as Last_seen from users u join userrooms ur on(u.useremail=ur.useremail)  join rooms r on(ur.roomid=r.roomid)  where r.roomid =$1 and u.useremail !=$2
`, [roomid, myid]);
    client.release();
    return result.rows;

}


async function home_render(req, res) {
    let roomid = req.params.room;
    if (roomid != "favicon.ico") {
        let check_room = await checkroom(roomid)
        if (check_room !== 0) {
            let contacts = await getcontacts(res.locals.user);
            let messages = await getmessages(req.params.room);
            contacts.forEach(c => {
                if (c.room_id == roomid) {
                    res.render("home.ejs", { contacts, messages, roomid, current_contact: c });
                }
            })
        }
        else {
            let contacts = await getcontacts(res.locals.user);
            res.render("home2.ejs", { contacts })
        }
    }



}
async function getmyinfo_api(req, res) {
    res.status(200).send(await getmyinfo(res.locals.user))
}

async function getmessages_api(req, res) {
    res.status(200).send(await getmessages(req.params["roomid"], req.params["page"]))
}
async function getcontacts_api(req, res) {
    // console.log(req.protocol + "//:" + req.get('host') + req.originalUrl)
    res.status(200).send(await getcontacts(res.locals.user))


}

async function get_not_contact_users_api(req, res) {
    res.status(200).send(await get_not_contact_users(res.locals.user))
}

async function get_room_info_api(req, res) {
    res.status(200).send(await get_room_info(req.params["roomid"], res.locals.user))
}

async function home_render2(req, res) {
    let contacts = await getcontacts(res.locals.user);
    res.render("home2.ejs", { contacts });

}
async function addcontacts_render(req, res) {
    let contacts = await get_not_contact_users(res.locals.user);
    res.render("addcontacts.ejs", { contacts });

}

async function addcontact_put(req, res) {
    let myid = res.locals.user;
    let partnerid = req.body.id;
    const roomid = await create_room(myid, partnerid)
    res.json(roomid)
}

async function updatemyname_put(req, res) {
    let myid = res.locals.user;
    // console.log("ddddddddddddddddddddd", myid,req.body)
    await updatemyname(myid,req.body.name);
    res.json({ name: req.body.name})
}

async function updatemyphoto_put(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname+'/tmp';

    form.parse(req, function (err, fields, files) {
        var oldpath =files.photo.filepath;
        var newpath = '/hdd/work/meet redesign/react messenger/messeger/uploads/' + files.photo.originalFilename;
        fs.rename(oldpath, newpath, async function (err) {
            if(err)
           console.log(err);
           else{
               let myid = res.locals.user;
                await updatemyphoto(myid,'/files/' + files.photo.originalFilename)
                res.json({ path: req.protocol + "://" + req.hostname + ":" + 4000 + "/files/" + files.photo.originalFilename })
           }
        });
    });
   
}

async function checkRoomAccessMiddleWhare(req, res, next) {
    const rowcount = await checkroomAccess(req.params["roomid"], res.locals.user)
    if (rowcount > 0) {
        next()
    }
    else {
        res.json({ redirect: "/" })
        //res.redirect("/")
    }
}


module.exports.home_render = home_render;
module.exports.getcontacts = getcontacts;
module.exports.home_render2 = home_render2;
module.exports.addcontacts_render = addcontacts_render;
module.exports.addcontact_put = addcontact_put;
module.exports.getcontacts_api = getcontacts_api;
module.exports.get_not_contact_users_api = get_not_contact_users_api;
module.exports.getmessages_api = getmessages_api;
module.exports.getmyinfo_api = getmyinfo_api;
module.exports.checkRoomAccessMiddleWhare = checkRoomAccessMiddleWhare;
module.exports.get_room_info_api = get_room_info_api;
module.exports.updatemyphoto_put = updatemyphoto_put;
module.exports.updatemyname_put = updatemyname_put;