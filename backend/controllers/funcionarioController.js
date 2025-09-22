//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');


exports.listarFuncionario = async (req, res) => {
  try {
    const result = await query(`
      SELECT f.id_pessoa, p.nome, f.id_supervisor, f.id_dep
      FROM funcionario f
      JOIN pessoa p ON f.id_pessoa = p.id_pessoa
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar funcionario:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarFuncionario = async (req, res) => {
  //  console.log('Criando funcionario com dados:', req.body);
  try {
    const { id_pessoa, id_dep, id_supervisor } = req.body;


    const result = await query(
      'INSERT INTO funcionario (id_pessoa, id_dep, id_supervisor ) VALUES ($1, $2, $3) RETURNING *',
      [id_pessoa, id_dep, id_supervisor ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar funcionario:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterFuncionario = async (req, res) => {
  // console.log('Obtendo funcionario com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM funcionario WHERE id_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionario não encontrado' });
    }

    res.json(result.rows[0]); //achou o funcionario e retorna todos os dados do funcionario
    //console.log('Funcionario encontrado:', result.rows[0]);

  } catch (error) {
    console.error('Erro ao obter funcionario:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarFuncionario = async (req, res) => {
  console.log('Atualizando funcionario com ID:', req.params.id, 'e dados:', req.body);
  try {
    const id = parseInt(req.params.id);

    const { id_dep, id_supervisor } = req.body;

    console.log('ID do funcionario a ser atualizado:' + id + ' Dados recebidos:' + id_dep + ' - ' + id_supervisor);


    // Verifica se a funcionario existe
    const existingPersonResult = await query(
      'SELECT * FROM funcionario WHERE id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionario não encontrado' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];

  

    const updatedFields = {
      id_dep: id_dep,
      id_supervisor: id_supervisor
    };
    // console.log('Campos da atualização:', updatedFields);

    // Atualiza a funcionario
    const updateResult = await query(
      'UPDATE funcionario SET id_dep = $1, id_supervisor = $2 WHERE id_pessoa = $3 RETURNING *',
      [updatedFields.id_dep, updatedFields.id_supervisor, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar funcionario:', error);

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarFuncionario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a funcionario existe
    const existingPersonResult = await query(
      'SELECT * FROM funcionario WHERE id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionario não encontrado' });
    }

    // Deleta a funcionario (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM funcionario WHERE id_pessoa = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar funcionario:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar funcionario com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
