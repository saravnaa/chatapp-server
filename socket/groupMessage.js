var model = require('../models')

module.exports = (message, sender, group, socket, socketObj) => {
    console.log("group message")
    model.message.findAll().then(messages => {
        model.message.create({
            message_identifier : `g:${group.name}:${sender.username}:${messages.length}`,
            message,
            from : sender.id
        })
        console.log(group.memberDetails.length)
        group.memberDetails.map(member => {
            // if(selectedGroup[member.username] === group.id){
                console.log(member.username,"group open")
                socket.to(socketObj[member.username].emit('incoming_group_message',{
                    message,
                    from : sender.id,
                    createdAt : new Date(Date.now()),
                    sender,
                    group,
                    username : member.username
                }))
            // }
        }
    )})
}