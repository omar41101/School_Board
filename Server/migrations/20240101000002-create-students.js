'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('students', {
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
      matricule: {
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
      level: {
        type: Sequelize.STRING,
        allowNull: false
      },
      class_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      section: {
        type: Sequelize.STRING,
        allowNull: true
      },
      admission_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended', 'graduated'),
        defaultValue: 'active'
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'parents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      blood_group: {
        type: Sequelize.STRING,
        allowNull: true
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      medical_conditions: {
        type: Sequelize.TEXT,
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
      previous_school_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      previous_school_year: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('students', ['matricule']);
    await queryInterface.addIndex('students', ['level', 'class_name']);
    await queryInterface.addIndex('students', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('students');
  }
};
