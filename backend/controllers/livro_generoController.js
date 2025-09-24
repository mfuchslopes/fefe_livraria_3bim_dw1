//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudLivro_genero = (req, res) => {
  console.log('livro_genero - Rota /abrirCrudLivro_genero');
  res.sendFile(path.join(__dirname, '../../frontend/livro_genero/livro_genero.html'));
}


 exports.listarLivro_genero = async (req, res) => {
   try {
     const result = await query('SELECT * FROM livro_genero');
    console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
     res.json(result.rows);
   } catch (error) {
    console.error('Erro ao listar professor:', error);
     res.status(500).json({ error: 'Erro interno do servidor' });
  }
 }

exports.obterLivro_generoList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
        'SELECT livro.id_livro, livro.nome_livro, livro.imagem_livro FROM livro JOIN livro_genero ON livro.id_livro = livro_genero.id_livro WHERE livro_genero.id_genero=$1  ORDER BY livro.id_livro',      
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Genero não encontrada' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter livro_genero:', error);
    res.status(500).json({ error: 'Erro interno do servidor - livro_genero' });
  }
}

exports.criarLivro_genero = async (req, res) => {
  try {
    const generoId = parseInt(req.params.id);
    const { livros } = req.body; // array de ids de livros

    // Remove todos os livros existentes do genero
    await query('DELETE FROM livro_genero WHERE id_genero=$1', [generoId]);

    // Insere os novos livros
    for (let livroId of livros) {
      await query('INSERT INTO livro_genero (id_livro, id_genero) VALUES ($1, $2)', [livroId, generoId]);
    }

    res.json({ message: 'Livros salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar livros do genero:', error);
    res.status(500).json({ error: 'Erro interno ao salvar livros' });
  }
};