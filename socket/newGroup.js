var model = require('../models')

module.exports = (users, socket, socketObj) => {
    users.map(user => {
        model.user.findOne({
            where : {
                id : user
            },
            attributes : ['username']
        })
        .then(user => {
            socket.to(socketObj[user.dataValues.username].emit('new_group'))
        })
    })
}