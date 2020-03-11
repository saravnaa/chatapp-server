'use strict';
module.exports = (sequelize, DataTypes) => {
  const chats = sequelize.define('chats', {
    userId: DataTypes.INTEGER,
    recieverId: DataTypes.INTEGER
  }, {});
  chats.associate = function(models) {
    // associations can be defined here
  };
  return chats;
};