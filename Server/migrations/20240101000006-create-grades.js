'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('grades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      exam_type: {
        type: Sequelize.ENUM('quiz', 'midterm', 'final', 'assignment', 'project', 'practical'),
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      marks: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_marks: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      grade: {
        type: Sequelize.ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'),
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      academic_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      semester: {
        type: Sequelize.ENUM('1', '2', 'Summer'),
        allowNull: false
      },
      exam_date: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('grades', ['student_id', 'course_id']);
    await queryInterface.addIndex('grades', ['academic_year', 'semester']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('grades');
  }
};
