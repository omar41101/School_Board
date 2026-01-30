'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('parents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      relationship: {
        type: Sequelize.ENUM('father', 'mother', 'guardian'),
        allowNull: false
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_zip_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergency_contact_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergency_contact_relationship: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergency_contact_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('parents', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('parents');
  }
};
