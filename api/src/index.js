import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Gerenciamento de Biblioteca',
      version: '1.0.0',
      description: 'Documentação da API para o Sistema de Gerenciamento de Biblioteca',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/index.js', './src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/auth', authRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna o status da API
 *     description: Endpoint para verificar se a API está online.
 *     responses:
 *       200:
 *         description: API está funcionando corretamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API - Sistema de Gerenciamento de Biblioteca
 */
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API - Sistema de Gerenciamento de Biblioteca' });
});

// Sincronizar banco e iniciar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida.');

    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`🚀 API rodando na porta ${PORT}`);
      console.log(`📄 Documentação do Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar com o banco de dados:', err);
    process.exit(1);
  }
}

startServer();
