'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'teachers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      credits: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      max_students: {
        type: Sequelize.INTEGER,
        defaultValue: 30
      },
      enrolled_students: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      schedule: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      syllabus: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'completed'),
        defaultValue: 'active'
      },
      academic_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      semester: {
        type: Sequelize.ENUM('1', '2', 'Summer'),
        allowNull: false
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

    await queryInterface.addIndex('courses', ['code']);
    await queryInterface.addIndex('courses', ['level', 'subject']);
    await queryInterface.addIndex('courses', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('courses');
  }
};
