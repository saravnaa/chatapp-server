var model = require('../models')

module.exports = (message,sender,reciever, socket, socketObj, name)=>{
    model.user.findOne({
        where : {
            username : reciever
        }
    })
    .then(reciever => {
        model.chats.findOne({
            where : {
                userId : reciever.dataValues.id,
                recieverId : sender.id
            }
        })  
        .then(res => {
            if(res === null){   
                model.chats.create({
                    userId : reciever.dataValues.id,
                    recieverId : sender.id
                })
                .then(res => {
                    socket.to(socketObj[reciever.dataValues.username].emit('new chat'))
                })
            }
        })
    })
    model.message.findAll().then(messages=> {
        model.message.create({
            message_identifier : sender.username>reciever ? `${sender.username}:${reciever}:${messages.length}` : `${reciever}:${sender.username}:${messages.length}`,
            message,
            from : sender.id
        })
    })
    model.user.findOne({
        attributes : ['id','username'],
        where : {
            username : name
        }
    })
    .then(data => {
        socket.to(socketObj[reciever].emit("incoming_message",{
            message,
            from : data.dataValues.id,
            username : data.dataValues.username,
            createdAt : new Date(Date.now())
        }))
        socket.to(socketObj[name].emit("incoming_message",{
            message,
            from : data.dataValues.id,
            username : data.dataValues.username,
            createdAt : new Date(Date.now())
        }))
    })
}