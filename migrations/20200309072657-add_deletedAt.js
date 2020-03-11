'use strict';
// var sequelize=require('sequelize')
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('messages', 'deletedAt', {
              type: Sequelize.DATE
          }, { transaction: t }),
          queryInterface.addColumn('groups', 'deletedAt', {
              type: Sequelize.DATE,
          }, { transaction: t }),
          queryInterface.addColumn('groupMembers', 'deletedAt', {
            type: Sequelize.DATE,
          }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.removeColumn('message', 'deletedAt', { transaction: t }),
          queryInterface.removeColumn('group', 'deletedAt', { transaction: t }),
          queryInterface.removeColumn('groupmembers', 'deletedAt', { transaction: t }),
      ])
    })
  }
};
