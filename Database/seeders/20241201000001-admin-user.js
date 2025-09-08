// Database/seeders/20241201000001-admin-user.js
'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminExists = await queryInterface.rawSelect('users', {
      where: {
        email: 'admin@tcrm.com'
      }
    }, ['id']);

    if (!adminExists) {
      await queryInterface.bulkInsert('users', [
        {
          name: 'Super Admin',
          email: 'admin@tcrm.com',
          username: 'admin',
          password: bcrypt.hashSync('admin123', 10),
          user_type: 'admin',
          phone: '+919876543210',
          is_email_verified: true,
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Travel Manager',
          email: 'manager@tcrm.com',
          username: 'manager',
          password: bcrypt.hashSync('manager123', 10),
          user_type: 'manager',
          phone: '+919876543211',
          is_email_verified: true,
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Travel Agent',
          email: 'agent@tcrm.com',
          username: 'agent',
          password: bcrypt.hashSync('agent123', 10),
          user_type: 'agent',
          phone: '+919876543212',
          is_email_verified: true,
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['admin@tcrm.com', 'manager@tcrm.com', 'agent@tcrm.com']
      }
    }, {});
  }
};