'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = bcrypt.hashSync('senha123', 10);

    // Insert Users
    const users = await queryInterface.bulkInsert('users', [
      {
        name: 'System Admin',
        email: 'admin@biblioteca.com',
        password: passwordHash,
        role: 'ADMIN',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Chief Librarian',
        email: 'librarian@biblioteca.com',
        password: passwordHash,
        role: 'LIBRARIAN',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Dosia Kara',
        email: 'dosia@example.com',
        password: passwordHash,
        role: 'READER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Maria Gatto',
        email: 'maria@example.com',
        password: passwordHash,
        role: 'READER',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: ['id', 'role'] });

    // Find the Reader users
    const readerUser1 = users.find(u => u.role === 'READER' && u.id !== undefined);
    const readerUser2 = users.filter(u => u.role === 'READER').pop();

    const readerUserId1 = readerUser1 ? readerUser1.id : 3;
    const readerUserId2 = (readerUser2 && readerUser2.id !== readerUserId1) ? readerUser2.id : 4;

    // Insert Readers
    await queryInterface.bulkInsert('readers', [
      {
        user_id: readerUserId1,
        name: 'Dosia Kara',
        document_id: '9/05/2027',
        email: 'dosia@example.com',
        phone: '17-873856',
        address: 'Rua das Flores, 123',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: readerUserId2,
        name: 'Maria Gatto',
        document_id: '9/09/2025',
        email: 'maria@example.com',
        phone: '17-878897',
        address: 'Avenida Brasil, 456',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert some mock books
    await queryInterface.bulkInsert('books', [
      {
        title: 'Orgulho e Preconceito',
        author: 'Jane Austen',
        publisher: 'Editora A',
        publication_year: 1813,
        category: 'Romance',
        isbn: '978-0199535569',
        total_quantity: 5,
        available_quantity: 5,
        status: 'AVAILABLE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Cem Anos de Solidão',
        author: 'Gabriel García Márquez',
        publisher: 'Editora B',
        publication_year: 1967,
        category: 'Ficção',
        isbn: '978-0307474728',
        total_quantity: 3,
        available_quantity: 3,
        status: 'AVAILABLE',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loans', null, {});
    await queryInterface.bulkDelete('books', null, {});
    await queryInterface.bulkDelete('readers', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
