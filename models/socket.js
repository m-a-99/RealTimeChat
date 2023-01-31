// const { getcontacts}= require('./../controllers/homecontroller.js')
const { insert_message } = require('./user.js')
const socketio = require('socket.io');
const { check_user_socket}= require('./../middlewhare/authmiddlewhare.js')
function socketconnection(server){
   
    let io = socketio(server, { 
        cors: { 
            'origin': '*' 
        } 
    })

    io.use(check_user_socket);

    io.on("connection", socket => {
        console.log(socket.id)
        console.log(socket.user_id)
        socket.on("message", (message, room) => {
            message.sender_id=socket.user_id;
            insert_message(message.massage_id, message.body, message.send_time, message.sender_id, room);
            message.sender_id=socket.user_id;
            socket.to(room).emit("res-message", message)
        })
        socket.on("joinroom", room => {
            socket.join(room)
        })

        socket.on('disconnect', function () {
            console.log(socket.id+' Got disconnect!');})

        // socket.on("echo",(h,cb)=>cb("dzzzzzzzzzzzzzzz"))
    })
}
module.exports.socketconnection = socketconnection;
