'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    message_identifier: DataTypes.STRING,
    message: DataTypes.STRING,
    from: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid : true
  });
  message.associate = function(models) {
    message.hasMany(models.user, {foreignKey : 'id', targetKey : 'from'})
  };
  return message;
};