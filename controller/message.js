var model = require('../models')
var {Op} = require('sequelize')

module.exports.getPrivateMessages = (req, res) => {
    // res.json(req.params.messageIdentifier)
    model.message.findAll({
        attributes : ['message', 'createdAt', 'from'],
        where : {
            message_identifier : {
                [Op.startsWith] : req.params.messageIdentifier
            }
        },
        order : [
            ['createdAt' , 'ASC']
        ]
    })
    .then(result=> res.json(result))
}

module.exports.getGroupMessages = (req, res) => {
    const groupId = req.params.groupId
    model.group.findOne({
        where : {
            id : groupId
        }
    })
    .then(group => {
        model.message.findAll({
            attributes : ['message', 'createdAt', 'from'],
            where : {
                message_identifier : {
                    [Op.startsWith] : `g:${group.dataValues.name}:`
                }
            },
            order : [['createdAt', 'ASC']],
        })
        .then(async result => {
            // await result.map(async data => {
            //     const user = await model.user.findOne({
            //         where : {
            //             id : data.dataValues.from
            //         }
            //     })
            //     data.dataValues.sender = user.dataValues
            //     console.log(1)
            // })
            for(var i=0;i<result.length;i++){
                const user = await model.user.findOne({
                    where : {
                        id : result[i].dataValues.from
                    }
                })
                result[i].dataValues.sender = user.dataValues
                // console.log(1)
            }
            // console.log(result)
            res.json(result)
        })
    })
}