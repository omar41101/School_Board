'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
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
      type: {
        type: Sequelize.ENUM('tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD'
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'overdue', 'cancelled', 'refunded'),
        defaultValue: 'pending'
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      paid_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'card', 'bank-transfer', 'cheque', 'online'),
        allowNull: true
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      academic_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      semester: {
        type: Sequelize.ENUM('1', '2', 'Summer'),
        allowNull: true
      },
      receipt_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      invoice_url: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('payments', ['student_id', 'status']);
    await queryInterface.addIndex('payments', ['due_date']);
    await queryInterface.addIndex('payments', ['academic_year', 'semester']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};
