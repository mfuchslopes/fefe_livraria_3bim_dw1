//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudCarrinho = (req, res) => {
  console.log('carrinhoController - Rota /abrirCrudCarrinho - abrir o crudCarrinho');
  res.sendFile(path.join(__dirname, '../../frontend/carrinho/carrinho.html'));
}

exports.listarCarrinho = async (req, res) => {
  try {
    const result = await query(`
      SELECT c.id_carrinho, c.data_carrinho, c.id_pessoa, p.nome
      FROM carrinho c
      JOIN pessoa p ON c.id_pessoa = p.id_pessoa
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar carrinhos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarCarrinho = async (req, res) => {
  //  console.log('Criando carrinho com dados:', req.body);
  try {
    const { id_carrinho, data_carrinho, id_pessoa } = req.body;


    const result = await query(
      'INSERT INTO carrinho (id_carrinho, data_carrinho, id_pessoa ) VALUES ($1, $2, $3) RETURNING *',
      [id_carrinho, data_carrinho, id_pessoa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar carrinho:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterCarrinho = async (req, res) => {
  // console.log('Obtendo carrinho com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    res.json(result.rows[0]); //achou o carrinho e retorna todos os dados do carrinho
    //console.log('Carrinho encontrado:', result.rows[0]);

  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarCarrinho = async (req, res) => {
  console.log('Atualizando carrinho com ID:', req.params.id, 'e dados:', req.body);
  try {
    const id = parseInt(req.params.id);

    const { data_carrinho, id_pessoa } = req.body;

    console.log('ID do carrinho a ser atualizado:' + id + ' Dados recebidos:' + data_carrinho + ' - ' + id_pessoa);


    // Verifica se a carrinho existe
    const existingCarrinhoResult = await query(
      'SELECT * FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    if (existingCarrinhoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentCarrinho = existingCarrinhoResult.rows[0];

  

    const updatedFields = {
      data_carrinho: data_carrinho !== undefined ? data_carrinho : currentCarrinho.data_carrinho,
      id_pessoa: id_pessoa !== undefined ? id_pessoa : currentCarrinho.id_pessoa,
    };
    // console.log('Campos da atualização:', updatedFields);

    // Atualiza a carrinho
    const updateResult = await query(
      'UPDATE carrinho SET data_carrinho = $1, id_pessoa = $2 WHERE id_carrinho = $3 RETURNING *',
      [updatedFields.data_carrinho, updatedFields.id_pessoa, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarCarrinho = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a carrinho existe
    const existingCarrinhoResult = await query(
      'SELECT * FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    if (existingCarrinhoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Deleta a carrinho (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM carrinho WHERE id_carrinho = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar carrinho:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar carrinho com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
