//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

// exports.abrirCrudLivro_autor = (req, res) => {
//  // console.log('livro_autorController - Rota /abrirCrudLivro_autor - abrir o crudLivro_autor');
//   res.sendFile(path.join(__dirname, '../../frontend/livro_autor/livro_autor.html'));
// }

exports.listarLivro_autors = async (req, res) => {
  try {
    const result = await query('SELECT * FROM livro_autor ORDER BY id_autor');
   // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar livro_autor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


///////////////////////////////////////////////////////////////////// 
// Função para criar um novo livro de autor no banco de dados.
exports.criarLivro_autor = async (req, res) => {
  try {
    const { id_autor, id_livro } = req.body;

    // Verifica se os dados necessários foram fornecidos.
    if (!id_autor || !id_livro) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: id_autor, id_livro.' });
    }

    // Você pode adicionar mais verificações aqui, por exemplo,
    // se o autor e o livro existem.

    // Executa a query de inserção.
    const result = await query(
      'INSERT INTO livro_autor (id_autor, id_livro) VALUES ($1, $2) RETURNING *',
      [id_autor, id_livro]
    );


    // Retorna o livro recém-criado.
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar livro_autor:', error);

    // Trata erros de PK duplicada (se a combinação de autor_id e livro_id já existe).
    if (error.code === '23505') {
      return res.status(409).json({ error: 'O livro do autor já existe. Use a função de atualização para modificar.' });
    }

    // Trata erros de foreign key (se o autor ou livro não existirem).
    if (error.code === '23503') {
      return res.status(400).json({ error: 'O ID do autor ou do livro não existe.' });
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


/////////////////////////////////////////////////////////////////////
// função para obter itens de um autor específico
/////////////////////////////////////////////////////////////////////

exports.obterItensDeUmLivro_autor = async (req, res) => {
  try {
    console.log("Requisição recebida para obter itens de um autor especifico: rota livro_autor/:idAutor");
    // 1. Extrai o ID do autor dos parâmetros da requisição
    const { idAutor } = req.params;

    // 2. A query SQL com o parâmetro seguro ($1)
    const result = await query(
      'SELECT cl.id_autor , cl.id_livro , l.nome_livro' +
      ' FROM livro_autor cl, livro l ' +
      ' WHERE cl.id_autor = $1 and  cl.id_livro = l.id_livro ORDER BY cl.id_livro;',
      [idAutor]
    );

    // 4. Verifica se foram encontrados itens
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum livro encontrado para este autor.' });
    }

    // 5. Retorna os itens encontrados
    res.status(200).json(result.rows);

  } catch (error) {
    // 6. Em caso de erro, retorna uma mensagem de erro genérica
    console.error('Erro ao obter itens do autor:', error);
    res.status(500).json({ message: 'Erro ao processar a requisição.', error: error.message });
  }
};

exports.obterLivro_autor = async (req, res) => {
  try {
    console.log("Requisição recebida para obter livro_autor (chave composta): rota livro_autor/:id_autor/:id_livro");
    
    //chave composta id_autor e id_livro
    const { id_autor, id_livro } = req.params;
    const idAutor = parseInt(id_autor);
    const idLivro = parseInt(id_livro);

    //console.log("estou no obter livro_autor =>" + " IdAutor=" + idAutor + " idLivro= " + idLivro);
    // Verifica se ambos os IDs são números válidos
    if (isNaN(idAutor) || isNaN(idLivro)) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' });
    }

    const result = await query(
      'SELECT cl.id_autor , cl.id_livro , l.nome_livro ' +
      ' FROM livro_autor cl, livro l ' +
      ' WHERE cl.id_autor = $1 AND cl.id_livro=$2 AND cl.id_livro = l.id_livro' +
      ' ORDER BY cl.id_autor;',
      [idAutor, idLivro]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livro_autor não encontrado' });
    }

    res.json(result.rows); //retorna todos os itens do autor
  } catch (error) {
    console.error('Erro ao obter livro_autor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// exports.atualizarLivro_autor = async (req, res) => {
//   try {
//     // Imprime todos os parâmetros da requisição para debugar
//     console.log("---------------rota atualizar livro ------------------------");
//     // console.log("Requisição recebida para atualizar livro:");
//     // console.log("Parâmetros da URL (req.params):", req.params);
//     // console.log("Corpo da requisição (req.body):", req.body);
//     // console.log("---------------------------------------");

//     // Extraímos ambos os IDs dos parâmetros da requisição, considerando a PK composta
//     const { id_autor, id_livro } = req.params;
//     const dadosParaAtualizar = req.body;

//     //    console.log("id_autor:", id_autor, "id_livro:", id_livro);
//     //    console.log("dadosParaAtualizar:", dadosParaAtualizar);

//     // Verifica se ambos os IDs são números válidos
//     if (isNaN(parseInt(id_autor)) || isNaN(parseInt(id_livro))) {
//       return res.status(400).json({ error: 'IDs devem ser números válidos' });
//     }

//     // Verifica se a livro_autor existe  


//     // Verifica se a livro_autor existe
//     const existingPersonResult = await query(
//       'SELECT * FROM livro_autor WHERE id_autor = $1 AND id_livro = $2',
//       [id_autor, id_livro]
//     );

//     if (existingPersonResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Livro_autor não encontrado' });
//     }

    

//     if (Object.keys(updatedFields).length === 0) {
//       return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
//     }

//     // console.log("Campos a serem atualizados:", updatedFields);
//     //  console.log("ID da livro_autor a ser atualizada:", id_autor, id_livro);


//     // Atualiza a livro_autor
//     const updateResult = await query( // Ajuste na query para considerar a PK composta
//       'UPDATE livro_autor SET quant_livro = $1 WHERE id_autor = $2 AND id_livro = $3 RETURNING *',
//       [updatedFields.quant_livro, id_autor, id_livro]
//     );

//     res.json(updateResult.rows[0]);
//   } catch (error) {
//     console.error('Erro ao atualizar livro_autor:', error);


//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// }

exports.deletarLivro_autor = async (req, res) => {
  try {
    // 1. Extraímos ambos os IDs da chave primária composta da URL
    const { id_autor, id_livro } = req.params;

    // Imprime os IDs para depuração
    console.log("---------------- rota deletar autor -----------------------");
    // console.log("Requisição recebida para deletar livro:");
    // console.log("Parâmetros da URL (req.params):", req.params);
    // console.log("---------------------------------------");

    // 2. Verifica se ambos os IDs são números válidos
    if (isNaN(parseInt(id_autor)) || isNaN(parseInt(id_livro))) {
      return res.status(400).json({ error: 'IDs de autor e livro devem ser números válidos.' });
    }

    // 3. Verifica se o livro do autor existe antes de tentar deletar
    const existingLivroResult = await query(
      'SELECT * FROM livro_autor WHERE id_autor = $1 AND id_livro = $2',
      [id_autor, id_livro]
    );

    if (existingLivroResult.rows.length === 0) {
      return res.status(404).json({ error: 'Livro do autor não encontrado.' });
    }

    // 4. Deleta o livro usando a chave primária composta
    const deleteResult = await query(
      'DELETE FROM livro_autor WHERE id_autor = $1 AND id_livro = $2',
      [id_autor, id_livro]
    );

    // Se a deleção foi bem-sucedida (uma linha afetada), retorna 204
    if (deleteResult.rowCount > 0) {
      res.status(204).send();
    } else {
      // Caso raro, se a verificação inicial passou mas a deleção não afetou nenhuma linha
      res.status(404).json({ error: 'Livro do autor não encontrado para exclusão.' });
    }

  } catch (error) {
    console.error('Erro ao deletar livro do autor:', error);

    // A maioria dos erros aqui será interna, já que a verificação de FK não se aplica
    // diretamente, pois a tabela de junção não tem dependentes.
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

