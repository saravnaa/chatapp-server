var handleOnline = require('./online')
var handlePrivateMessage = require('./privateMessage')
var handleNewGroup = require('./newGroup')
var handleGroupMessage = require('./groupMessage')
var handleOffline = require('./offline')

module.exports = {
    handleOnline,
    handlePrivateMessage,
    handleNewGroup,
    handleGroupMessage,
    handleOffline
}