var model = require('../models')
var {Op} = require('sequelize')
module.exports.createGroup = (req, res) => {
    model.group.create({
        name : req.body.name,
        admin : parseInt(req.body.admin)
    })
    .then(group => {
        // console.log(group)
        group.createGroupMember({
            userId:parseInt(req.body.admin)
        })
        req.body.users.map(userId => group.createGroupMember({
            userId : parseInt(userId)
        }))
        res.json(group.dataValues)
    })
}

module.exports.getUserGroups = (req, res) => {
    const userId = req.params.userId
    model.group.findAll({
        attributes : ['id','name','admin'],
        include : [{
            model : model.groupMembers,
            where : {
                userId
            }
        }]
    })
    .then(data => res.json(data))
}

module.exports.getGroupDetails = (req, res) => {
    const groupId = parseInt(req.params.groupId)
    model.group.findOne({
        where:{
            id : groupId
        }
    })
    .then(group => {
        group.getGroupMembers()
        .then(async groupMembers => {
            group.dataValues.memberDetails = await getMemberDetails(groupMembers, res)
            res.json(group)
        })
    })
}

const getMemberDetails = async (members, res) => {
    var membersDetails =[]
    for(var i=0;i<members.length;i++){
        const memberDetail = await members[i].getUser({
            attributes:['id','username']
        })
        membersDetails = [...membersDetails,memberDetail]
    }
    // console.log("md",membersDetails)
    return membersDetails
    // var memberDetails = members.map(async member => await member.getUser().then(data=>data))
    // console.log(memberDetails)
}

module.exports.leaveGroup = (req, res) => {
    const {userId, groupId} = req.body
    model.groupMembers.destroy({
        where : {
            groupId,
            userId
        }
    })
    .then(result => {
        model.groupMembers.findAll({
            where : {
                groupId
            }
        })
        .then(gm => {
            if(gm.length===0){
                model.group.findOne({
                    where : {
                        id : groupId
                    },
                    attributes : ['name']
                })
                .then(groupName => {
                    model.message.destroy({
                        where : {
                            message_identifier : {
                                [Op.startsWith] : `g:${groupName.dataValues.name}`
                            }
                        }
                    })
                })
                model.group.destroy({
                    where : {
                        id : groupId
                    }
                })
            }
        })
        res.json(result)
    })
}
