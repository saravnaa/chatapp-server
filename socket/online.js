const model = require('../models')
// const {Op} = require('sequelize')

// var selectedGroup = {}

module.exports = (socket, socketObj, name, usernames) => {
    console.log(name,"connected")
    usernames.map(username => socket.to(socketObj[username].emit('online',name)))
    model.user.update({
        online :true
    },{
        where : {
            username : name
        }
    })
    .then(console.log)
}