var model = require('../models')

module.exports = (name, usernames, socket, socketObj) => {
    console.log(name,"disconnected")
    // selectedGroup[name] = undefined
    usernames.map(username => {
        return socket.to(socketObj[username].emit('offline',name))
        // console.log(username)
    })
    model.user.update(
        { online:false, lastSeen:new Date(Date.now())},
        { where : { username : name}}
    )
    .then(console.log)
}