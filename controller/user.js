const bcrypt = require('bcrypt')
const model = require('../models')
const {Op} = require('sequelize')
var {
    handleOnline, handlePrivateMessage, handleNewGroup, handleGroupMessage, handleOffline
} = require('../socket')

let socketObj = {}
let selectedGroup = {}

module.exports.signin = (req, res) => {
    const {username, password} = req.body

    model.user.findOne({
        where : {
            username
        }
    })
    .then(data => {
        if(data !== null)
            bcrypt.compare(password, data.dataValues.password, (err, result) => {
                if(!err && result){
                    res.json(data.dataValues)
                } else {
                    res.status(401).json({error : "Invalid username or password"})
                }
            })
        else 
            res.status(401).json({error : "Invalid username or password"})
    })
}

module.exports.signup = (req, res) => {
    const { username, password} = req.body

    model.user.findOne({
        where : {
            username
        }
    })
    .then(result => {
        if(result === null){
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    model.user.create({
                        username,
                        password : hash,
                        online : true,
                        lastSeen : new Date(Date.now())
                    })
                    .then(user => res.json(user.dataValues))
                });
            });
        }
    })
}

module.exports.createSocket =async (io, req, res) => {
    model.user.findAll({
        attributes : ['username']
    })
    .then(data => {
        var usernames = data.map(user => user.dataValues.username)
        usernames.map(name => {
            try{
                if(!socketObj[name]){
                    socketObj[name] = io.of(name).on('connection', async (socket) => {
                        handleOnline(socket, socketObj, name, usernames)
                        
                        socket.on("message",(message,sender,reciever)=> handlePrivateMessage(message,sender,reciever, socket, socketObj, name))
                        
                        socket.on('new_group',(users) => handleNewGroup(users, socket, socketObj))
                        // socket.on('selected_group',(user, groupId) => {
                        //     selectedGroup[user.username] = groupId
                        // })
                        socket.on('group_message', (message,sender,group) => handleGroupMessage(message, sender, group, socket, socketObj))
                        
                        socket.on("disconnect", ()=> handleOffline(name, usernames, socket, socketObj))
                    })
                }
            } catch(e){
                console.log("error",e)
            }
        })
        res.json("created")
    })
}

module.exports.getUserChats = (req, res) => {
    model.user.findOne({
        where : {
            id : req.params.userId
        }
    })
    .then(user => {
        user.getChats()
        .then(data => {
            var userId = data.map(d => d.dataValues.recieverId)
            // console.log(userId)
            model.user.findAll({
                attributes : ['username'],
                where : {
                    id : userId
                }
            })
            .then(data=>{
                var usernames =data.map(d=> d.dataValues.username) 
                
                // console.log("socket", socketObj)
                res.json(usernames)
            })
            // res.json(data.map(d=>d.dataValues))
            // var usernames = data.map(user=> user.dataValues.username);
            // res.send(usernames)
        })
    })

}

module.exports.addChat = (req, res) => {
    model.user.findOne({
        attributes : ['id'],
        where : {
            username : req.body.reciever
        }
    })
    .then(data => {
        console.log(data.dataValues.id)
        return model.chats.create({
            userId : req.body.userId,
            recieverId : data.dataValues.id
        })
        .then(data => res.json("added"))
    })
}

module.exports.removeChat = (req, res) => {
    model.user.findOne({
        where : {
            id : req.body.userId
        }
    })
    .then(user=> {
        console.log(user)
        model.user.findOne({
            attributes : ['id'],
            where : {
                username : req.body.reciever
            }
        })
        .then(reciever => {
            console.log({userId : user.dataValues.id,
                recieverId : reciever.dataValues.id})
            model.chats.destroy({
                where : {
                    userId : user.dataValues.id,
                    recieverId : reciever.dataValues.id
                }
            })
            .then(result=> result===1?res.json("deleted"):res.json("error"))
        })
    })
}

module.exports.allUsersExceptCurrent = (req, res) => {
    const userId = parseInt(req.params.userId);
    model.user.findAll({
        where : {
            id : {
                [Op.not] : userId
            }
        }
    })
    .then(data => res.json(data.map(d=>d.dataValues)))
}

module.exports.newChatUsername = (req, res) => {
    var {userId} = req.params
    model.user.findOne({
        where : {
            id : userId
        }
    })
    .then(user => {
        user.getChats()
        .then(chats => {
            usersId=chats.map(chat => chat.dataValues.recieverId)
            usersId = [...usersId,parseInt(userId)]
            model.user.findAll({
                attributes:['username'],
                where : {
                    id : {
                        [Op.not] : usersId
                    }
                }
            })
            .then(data => res.json(data.map(d => d.dataValues.username)))
        })
    })
}

module.exports.getOnlineStatus = (req, res) => {
    console.log("hit")
    model.user.findOne({
        where : {
            username : req.params.username
        },
        attributes : ['online','lastSeen']
    })
    .then(data => res.json(data))
}

module.exports.socketObj =  {
    socketObj
}
