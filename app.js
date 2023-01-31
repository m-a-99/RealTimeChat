const http = require('http');
// const fs = require('fs')
const express = require('express');
const auth = require('./router/auth');
const api = require('./router/api');
// const cors = require('cors')
const { socketconnection } = require('./models/socket.js')
const { check_user, requireAuth} = require('./middlewhare/authmiddlewhare.js')
// const { home_render, home_render2, getcontacts, addcontact_put}= require('./controllers/homecontroller.js')

let app = express();

// const corsOptions = {
//     origin:"*",
//     credentials: true,
//     optionSuccessStatus: 200


// }

// app.use(cors(corsOptions))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');

    next();
});


// const options = {
//     key: fs.readFileSync(__dirname + '/key.pem'),
//     cert: fs.readFileSync(__dirname + '/cert.pem')
// };

let server = http.createServer(app)
socketconnection(server)
const cookieParser = require('cookie-parser');
app.use(express.static("build"))


app.set('view engine', 'ejs');

app.use(cookieParser())

app.use(express.urlencoded({extended: true }));

app.use(express.json())

app.all('*', check_user)

app.use(auth)


app.use("/api", api)
app.get("/files/:file",(req,res)=>{
    res.sendFile("/hdd/work/meet redesign/react messenger/messeger/uploads/"+req.params.file)
})

// app.get("/index",(req,res)=>{
//     res.sendFile(__dirname+"/index.html")
// })
app.get(["/","/:id"],requireAuth,(req,res)=>{
    res.render("index.ejs")
})

// app.get('/getcontacts', requireAuth, getcontacts)
// app.put("/addcontacts", requireAuth,addcontact_put)
// app.get('/:room/', requireAuth, home_render)
// app.get('/', requireAuth, home_render2 )






server.listen(4000)