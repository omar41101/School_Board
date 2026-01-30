'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teachers', {
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
      employee_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false
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
      qualification: {
        type: Sequelize.STRING,
        allowNull: false
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subjects: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      experience: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      joining_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'on-leave'),
        defaultValue: 'active'
      },
      classes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      schedule: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      documents: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('teachers', ['employee_id']);
    await queryInterface.addIndex('teachers', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('teachers');
  }
};
