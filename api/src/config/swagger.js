import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API - Sistema de Gerenciamento de Biblioteca',
    version: '1.0.0',
    description:
      'API REST para gerenciamento de livros, leitores e empréstimos de uma biblioteca.',
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor da API',
    },
  ],
  components: {
    schemas: {
      Book: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Orgulho e Preconceito' },
          author: { type: 'string', example: 'Jane Austen' },
          publisher: { type: 'string', example: 'Editora A' },
          publicationYear: { type: 'integer', example: 1813 },
          category: { type: 'string', example: 'Romance' },
          isbn: { type: 'string', example: '978-0199535569' },
          totalQuantity: { type: 'integer', example: 5 },
          availableQuantity: { type: 'integer', example: 3 },
          status: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE'] },
        },
      },
      BookInput: {
        type: 'object',
        required: ['title', 'author'],
        properties: {
          title: { type: 'string' },
          author: { type: 'string' },
          publisher: { type: 'string' },
          publicationYear: { type: 'integer' },
          category: { type: 'string' },
          isbn: { type: 'string' },
          totalQuantity: { type: 'integer', example: 5 },
        },
      },
      Reader: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          userId: { type: 'integer', nullable: true },
          name: { type: 'string', example: 'Dosia Kara' },
          documentId: { type: 'string', example: '123.456.789-00' },
          email: { type: 'string', example: 'dosia@example.com' },
          phone: { type: 'string', example: '(17) 98785-8856' },
          address: { type: 'string', example: 'Rua das Flores, 123' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
        },
      },
      ReaderInput: {
        type: 'object',
        required: ['name', 'documentId', 'email'],
        properties: {
          userId: { type: 'integer', nullable: true },
          name: { type: 'string' },
          documentId: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
        },
      },
      Loan: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          readerId: { type: 'integer', example: 1 },
          bookId: { type: 'integer', example: 1 },
          loanDate: { type: 'string', format: 'date-time' },
          dueDate: { type: 'string', format: 'date-time' },
          returnDate: { type: 'string', format: 'date-time', nullable: true },
          status: { type: 'string', enum: ['OPEN', 'RETURNED', 'LATE'] },
        },
      },
      LoanInput: {
        type: 'object',
        required: ['readerId', 'bookId', 'dueDate'],
        properties: {
          readerId: { type: 'integer', example: 1 },
          bookId: { type: 'integer', example: 1 },
          dueDate: { type: 'string', format: 'date', example: '2026-07-15' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'System Admin' },
          email: { type: 'string', example: 'admin@biblioteca.com' },
          role: { type: 'string', enum: ['ADMIN', 'LIBRARIAN', 'READER'] },
        },
      },
      UserInput: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string', format: 'password' },
          role: { type: 'string', enum: ['ADMIN', 'LIBRARIAN', 'READER'] },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./src/routes/*.routes.js', './src/routes/auth.js'],
})
