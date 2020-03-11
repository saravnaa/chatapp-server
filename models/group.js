'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    name: DataTypes.STRING,
    admin: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid : true
  });
  group.associate = function(models) {
    group.hasMany(models.groupMembers)
    group.hasOne(models.user, {foreignKey:"id", targetKey:"admin"})
  };
  return group;
};