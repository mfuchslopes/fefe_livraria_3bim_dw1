const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

const cookieParser = require('cookie-parser');

// Importar a configuração do banco PostgreSQL
const db = require('./database'); // Ajuste o caminho conforme necessário

// Configurações do servidor - quando em produção, você deve substituir o IP e a porta pelo do seu servidor remoto
//const HOST = '192.168.1.100'; // Substitua pelo IP do seu servidor remoto
const HOST = 'localhost'; // Para desenvolvimento local
const PORT_FIXA = 3001; // Porta fixa

// serve a pasta frontend como arquivos estáticos

// serve a pasta frontend como arquivos estáticos

const caminhoFrontend = path.join(__dirname, '../frontend');
console.log('Caminho frontend:', caminhoFrontend);

app.use(express.static(caminhoFrontend));



app.use(cookieParser());
// Middleware para permitir CORS (Cross-Origin Resource Sharing)
// Isso é útil se você estiver fazendo requisições de um frontend que está rodando em um domínio diferente
// ou porta do backend.
// Em produção, você deve restringir isso para domínios específicos por segurança.
// Aqui, estamos permitindo qualquer origem, o que é útil para desenvolvimento, mas deve ser ajustado em produção.
app.use((req, res, next) => {
  const allowedOrigins = ['http://127.0.0.1:5500','http://localhost:5500', 'http://127.0.0.1:5501', 'http://localhost:3000', 'http://localhost:3001'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // <-- responde ao preflight
  }

  next();
});



// Middleware para adicionar a instância do banco de dados às requisições
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Middlewares
app.use(express.json());

// Middleware de tratamento de erros JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON malformado',
      message: 'Verifique a sintaxe do JSON enviado'
    });
  }
  next(err);
});

// só mexa nessa parte
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Importando as rotas
// const loginRoutes = require('./routes/loginRoutes');
// app.use('/login', loginRoutes);

const menuRoutes = require('./routes/menuRoutes');
app.use('/menu', menuRoutes);



const pessoaRoutes = require('./routes/pessoaRoutes');
app.use('/pessoa', pessoaRoutes);

const funcionarioRoutes = require('./routes/funcionarioRoutes');
app.use('/funcionario', funcionarioRoutes);

const clienteRoutes = require('./routes/clienteRoutes');
app.use('/cliente', clienteRoutes);

const livro_autorRoutes = require('./routes/livro_autorRoutes');
app.use('/livro_autor', livro_autorRoutes);

const livro_generoRoutes = require('./routes/livro_generoRoutes');
app.use('/livro_genero', livro_generoRoutes);

// const professorRoutes = require('./routes/professorRoutes');
// app.use('/professor', professorRoutes);

// const avaliadorRoutes = require('./routes/avaliadorRoutes');
// app.use('/avaliador', avaliadorRoutes);

// const avaliadoRoutes = require('./routes/avaliadoRoutes');
// app.use('/avaliado', avaliadoRoutes);


// const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
// app.use('/avaliacao', avaliacaoRoutes);

// const avaliacaoHasQuestaoRoutes = require('./routes/avaliacaoHasQuestaoRoutes');
// app.use('/avaliacaoHasQuestao', avaliacaoHasQuestaoRoutes);

const departamentoRoutes = require('./routes/departamentoRoutes');
app.use('/departamento', departamentoRoutes);

const autorRoutes = require('./routes/autorRoutes');
app.use('/autor', autorRoutes);

const generoRoutes = require('./routes/generoRoutes');
app.use('/genero', generoRoutes);

const forma_pagamentoRoutes = require('./routes/forma_pagamentoRoutes');
app.use('/forma_pagamento', forma_pagamentoRoutes);

const livroRoutes = require('./routes/livroRoutes');
app.use('/livro', livroRoutes);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'O server está funcionando - essa é a rota raiz!',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});


// Rota para testar a conexão com o banco
app.get('/health', async (req, res) => {
  try {
    const connectionTest = await db.testConnection();

    if (connectionTest) {
      res.status(200).json({
        status: 'OK',
        message: 'Servidor e banco de dados funcionando',
        database: 'PostgreSQL',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        status: 'ERROR',
        message: 'Problema na conexão com o banco de dados',
        database: 'PostgreSQL',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Erro no health check:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Erro interno do servidor',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);

  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
    timestamp: new Date().toISOString()
  });
});


// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe`,
    timestamp: new Date().toISOString()
  });
});


/////////////////////////////////////////
/// PARTE DE UPLOAD DE IMAGENS /////

// Configuração do Multer para salvar imagens em /frontend/img
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(path.join(__dirname, '../img'))
    cb(null, path.join(__dirname, '../img'));
  },
  filename: (req, file, cb) => {
    console.log(file)
    // Pega o slug do corpo do formulário
    let slug = req.body.slug_genero || 'imagem';
    // Garante que o nome seja seguro
    slug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
    cb(null, `${slug}.jpg`);
  }
});

const upload = multer({ storage });
// Middleware para JSON
app.use(express.json());

// Servir imagens estáticas
app.use('/img', express.static(path.join(__dirname, '../img')));

// Rotas de gênero com upload aplicado
app.use('/genero', (req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && req.path === '/') {
    // quando for criar ou atualizar, processa upload da imagem
    upload.single('imagem_genero')(req, res, next);
  } else {
    next();
  }
}, generoRoutes);

///////////////////////////////////////////



// Inicialização do servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco antes de iniciar o servidor
    console.log(caminhoFrontend);
    console.log('Testando conexão com PostgreSQL...');
    const connectionTest = await db.testConnection();

    if (!connectionTest) {
      console.error('❌ Falha na conexão com PostgreSQL');
      process.exit(1);
    }

    console.log('✅ PostgreSQL conectado com sucesso');

    const PORT = process.env.PORT || PORT_FIXA;

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
      console.log(`📊 Health check disponível em http://${HOST}:${PORT}/health`);
      console.log(`🗄️ Banco de dados: PostgreSQL`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais para encerramento graceful
process.on('SIGINT', async () => {
  console.log('\n🔄 Encerrando servidor...');

  try {
    await db.pool.end();
    console.log('✅ Conexões com PostgreSQL encerradas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao encerrar conexões:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 SIGTERM recebido, encerrando servidor...');

  try {
    await db.pool.end();
    console.log('✅ Conexões com PostgreSQL encerradas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao encerrar conexões:', error);
    process.exit(1);
  }
});

// Iniciar o servidor
startServer();