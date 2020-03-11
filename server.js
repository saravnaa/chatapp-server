const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server, { origins : '*:*'})
// const router = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

// const router = 

const PORT = process.env.PORT || 4000

io.on('connection', function(socket) {
    socket.on("connect",(s)=>console.log(s))
})

app.use(bodyParser.urlencoded({extended : true}))
//user
const userController = require('./controller/user')
app.post('/signin', userController.signin)
app.post('/signup', userController.signup)
app.get('/userchats/:userId', userController.getUserChats)
app.get('/newchatusername/:userId',userController.newChatUsername)
app.get('/createsocket', (req, res) => userController.createSocket(io, req, res))
app.post('/addchat', userController.addChat)
app.post('/removechat', userController.removeChat)
app.get('/allusername/:userId', userController.allUsersExceptCurrent)
app.get('/online/:username', userController.getOnlineStatus)
//group
var groupController = require('./controller/group')
app.post('/creategroup', groupController.createGroup)
app.get('/getusergroups/:userId', groupController.getUserGroups)
app.get('/getgroupdetails/:groupId', groupController.getGroupDetails)
app.post('/leavegroup', groupController.leaveGroup)
    
//message
const messageController = require('./controller/message')
app.get("/privatemessage/:messageIdentifier",messageController.getPrivateMessages)
app.get('/groupmessages/:groupId', messageController.getGroupMessages)

server.listen(PORT, ()=> {
    console.log(`app running on port ${PORT}`)
})