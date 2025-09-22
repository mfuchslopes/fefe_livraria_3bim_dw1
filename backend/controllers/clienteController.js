//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');


exports.listarCliente = async (req, res) => {
  try {
    const result = await query('SELECT * FROM cliente ORDER BY id_pessoa');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarCliente = async (req, res) => {
    console.log('Criando cliente com dados:', req.body);
  try {
    const { id_pessoa } = req.body;


    const result = await query(
      'INSERT INTO cliente (id_pessoa) VALUES ($1) RETURNING *',
      [id_pessoa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterCliente = async (req, res) => {
  // console.log('Obtendo cliente com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM cliente WHERE id_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(result.rows[0]); //achou o cliente e retorna todos os dados do cliente
    //console.log('Cliente encontrado:', result.rows[0]);

  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.deletarCliente = async (req, res) => {
  console.log('Deletando cliente com ID:', req.params.id);
  try {
    const id = parseInt(req.params.id);
    // Verifica se a cliente existe
    const existingPersonResult = await query(
      'SELECT * FROM cliente WHERE id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Deleta a cliente (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM cliente WHERE id_pessoa = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar cliente com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
