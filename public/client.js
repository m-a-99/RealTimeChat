//  const socket = io('https://82.205.31.145/');


let message = document.querySelector("#message");
let chat_list = document.querySelector(".chatlist");
let chat_history = document.querySelector(".chat-history");


let send = document.querySelector(".send");

let room = window.location.pathname.split('/')[1];
let massageform = document.querySelector("#sendform");
const socket = io('/', {
    auth: {
        token: document.cookie,
        room:room
    }
});

socket.on("connect", () => {
    console.log(socket.id)
})


socket.on("res-message", (m, id) => {showmsg(m ,id)
console.log(m)})

send.addEventListener('click',()=>{
    if (message.value.trim() !== "") {
        showmsg(message.value, 'me')
        socket.emit("message", message.value, room)
    }
    message.value = ''
})
massageform.addEventListener("submit", e => {
    e.preventDefault();

    if (message.value.trim() !== "") {
        showmsg(message.value, 'me')
        socket.emit("message", message.value, room)
    }
    message.value = ''
})

// join.addEventListener("click", () => {
//     socket.emit("joinroom", room.value)
// })

function showmsg(messagebody, user) {
    let messagetmp = "";
    if (user === 'me') {
       messagetmp= `<li class="clearfix">
    <div class="message-data text-right">
        <span class="message-data-time">10:10 AM, Today</span>
        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
    </div>
    <div class="message other-message float-right">
        ${messagebody}
    </div>
        </li>`
    }
    else{
        messagetmp =`<li class="clearfix">
    <div class="message-data">
    <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar">
        <span class="message-data-time">10:12 AM, Today</span>
        
    </div>
    <div class="message my-message">
        ${messagebody}
    </div>
    </li>`
    }
    chat_list.innerHTML += messagetmp;
    chat_history.scrollTop = chat_history.scrollHeight - chat_history.clientHeight;

}
