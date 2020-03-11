'use strict';
module.exports = (sequelize, DataTypes) => {
  const groupMembers = sequelize.define('groupMembers', {
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid : true
  });
  groupMembers.associate = function(models) {
    groupMembers.belongsTo(models.user)
  };
  return groupMembers;
};