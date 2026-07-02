import 'dotenv/config'
import app from './app.js'
import { sequelize } from './models/index.js'

const PORT = process.env.PORT || 3000

async function start() {
  try {
    // Só testa se consegue falar com o Postgres. NÃO usamos sequelize.sync()
    // aqui de propósito -- quem cria/altera tabelas são as migrations
    // (sequelize-cli), pra manter o histórico de mudanças do banco versionado.
    await sequelize.authenticate()
    console.log('✅ Conexão com o banco de dados estabelecida.')

    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Não foi possível conectar ao banco de dados:', err.message)
    process.exit(1)
  }
}

start()
