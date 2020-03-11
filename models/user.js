'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    online: DataTypes.BOOLEAN,
    lastSeen: DataTypes.DATE
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.chats, {foreignKey : 'userId'})
    user.hasMany(models.chats, {foreignKey : 'recieverId'})
  };
  return user;
};