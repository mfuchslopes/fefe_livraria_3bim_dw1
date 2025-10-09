//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

// exports.abrirCrudLivro_genero = (req, res) => {
//  // console.log('livro_generoController - Rota /abrirCrudLivro_genero - abrir o crudLivro_genero');
//   res.sendFile(path.join(__dirname, '../../frontend/livro_genero/livro_genero.html'));
// }

exports.listarLivro_generos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM livro_genero ORDER BY id_genero');
   // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar livro_genero:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


///////////////////////////////////////////////////////////////////// 
// Função para criar um novo livro de genero no banco de dados.
exports.criarLivro_genero = async (req, res) => {
  try {
    const { id_genero, id_livro } = req.body;

    // Verifica se os dados necessários foram fornecidos.
    if (!id_genero || !id_livro) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: id_genero, id_livro.' });
    }

    // Você pode adicionar mais verificações aqui, por exemplo,
    // se o genero e o livro existem.

    // Executa a query de inserção.
    const result = await query(
      'INSERT INTO livro_genero (id_genero, id_livro) VALUES ($1, $2) RETURNING *',
      [id_genero, id_livro]
    );


    // Retorna o livro recém-criado.
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar livro_genero:', error);

    // Trata erros de PK duplicada (se a combinação de genero_id e livro_id já existe).
    if (error.code === '23505') {
      return res.status(409).json({ error: 'O livro do genero já existe. Use a função de atualização para modificar.' });
    }

    // Trata erros de foreign key (se o genero ou livro não existirem).
    if (error.code === '23503') {
      return res.status(400).json({ error: 'O ID do genero ou do livro não existe.' });
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


/////////////////////////////////////////////////////////////////////
// função para obter itens de um genero específico
/////////////////////////////////////////////////////////////////////

exports.obterItensDeUmLivro_genero = async (req, res) => {
  try {
    console.log("Requisição recebida para obter itens de um genero especifico: rota livro_genero/:idGenero");
    // 1. Extrai o ID do genero dos parâmetros da requisição
    const { idGenero } = req.params;

    // 2. A query SQL com o parâmetro seguro ($1)
    const result = await query(
      'SELECT cl.id_genero , cl.id_livro , l.nome_livro' +
      ' FROM livro_genero cl, livro l ' +
      ' WHERE cl.id_genero = $1 and  cl.id_livro = l.id_livro ORDER BY cl.id_livro;',
      [idGenero]
    );

    // 4. Verifica se foram encontrados itens
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum livro encontrado para este genero.' });
    }

    // 5. Retorna os itens encontrados
    res.status(200).json(result.rows);

  } catch (error) {
    // 6. Em caso de erro, retorna uma mensagem de erro genérica
    console.error('Erro ao obter itens do genero:', error);
    res.status(500).json({ message: 'Erro ao processar a requisição.', error: error.message });
  }
};

exports.obterLivro_genero = async (req, res) => {
  try {
    console.log("Requisição recebida para obter livro_genero (chave composta): rota livro_genero/:id_genero/:id_livro");
    
    //chave composta id_genero e id_livro
    const { id_genero, id_livro } = req.params;
    const idGenero = parseInt(id_genero);
    const idLivro = parseInt(id_livro);

    //console.log("estou no obter livro_genero =>" + " IdGenero=" + idGenero + " idLivro= " + idLivro);
    // Verifica se ambos os IDs são números válidos
    if (isNaN(idGenero) || isNaN(idLivro)) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' });
    }

    const result = await query(
      'SELECT cl.id_genero , cl.id_livro , l.nome_livro ' +
      ' FROM livro_genero cl, livro l ' +
      ' WHERE cl.id_genero = $1 AND cl.id_livro=$2 AND cl.id_livro = l.id_livro' +
      ' ORDER BY cl.id_genero;',
      [idGenero, idLivro]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livro_genero não encontrado' });
    }

    res.json(result.rows); //retorna todos os itens do genero
  } catch (error) {
    console.error('Erro ao obter livro_genero:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// exports.atualizarLivro_genero = async (req, res) => {
//   try {
//     // Imprime todos os parâmetros da requisição para debugar
//     console.log("---------------rota atualizar livro ------------------------");
//     // console.log("Requisição recebida para atualizar livro:");
//     // console.log("Parâmetros da URL (req.params):", req.params);
//     // console.log("Corpo da requisição (req.body):", req.body);
//     // console.log("---------------------------------------");

//     // Extraímos ambos os IDs dos parâmetros da requisição, considerando a PK composta
//     const { id_genero, id_livro } = req.params;
//     const dadosParaAtualizar = req.body;

//     //    console.log("id_genero:", id_genero, "id_livro:", id_livro);
//     //    console.log("dadosParaAtualizar:", dadosParaAtualizar);

//     // Verifica se ambos os IDs são números válidos
//     if (isNaN(parseInt(id_genero)) || isNaN(parseInt(id_livro))) {
//       return res.status(400).json({ error: 'IDs devem ser números válidos' });
//     }

//     // Verifica se a livro_genero existe  


//     // Verifica se a livro_genero existe
//     const existingPersonResult = await query(
//       'SELECT * FROM livro_genero WHERE id_genero = $1 AND id_livro = $2',
//       [id_genero, id_livro]
//     );

//     if (existingPersonResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Livro_genero não encontrado' });
//     }

    

//     if (Object.keys(updatedFields).length === 0) {
//       return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
//     }

//     // console.log("Campos a serem atualizados:", updatedFields);
//     //  console.log("ID da livro_genero a ser atualizada:", id_genero, id_livro);


//     // Atualiza a livro_genero
//     const updateResult = await query( // Ajuste na query para considerar a PK composta
//       'UPDATE livro_genero SET quant_livro = $1 WHERE id_genero = $2 AND id_livro = $3 RETURNING *',
//       [updatedFields.quant_livro, id_genero, id_livro]
//     );

//     res.json(updateResult.rows[0]);
//   } catch (error) {
//     console.error('Erro ao atualizar livro_genero:', error);


//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// }

exports.deletarLivro_genero = async (req, res) => {
  try {
    // 1. Extraímos ambos os IDs da chave primária composta da URL
    const { id_genero, id_livro } = req.params;

    // Imprime os IDs para depuração
    console.log("---------------- rota deletar genero -----------------------");
    // console.log("Requisição recebida para deletar livro:");
    // console.log("Parâmetros da URL (req.params):", req.params);
    // console.log("---------------------------------------");

    // 2. Verifica se ambos os IDs são números válidos
    if (isNaN(parseInt(id_genero)) || isNaN(parseInt(id_livro))) {
      return res.status(400).json({ error: 'IDs de genero e livro devem ser números válidos.' });
    }

    // 3. Verifica se o livro do genero existe antes de tentar deletar
    const existingLivroResult = await query(
      'SELECT * FROM livro_genero WHERE id_genero = $1 AND id_livro = $2',
      [id_genero, id_livro]
    );

    if (existingLivroResult.rows.length === 0) {
      return res.status(404).json({ error: 'Livro do genero não encontrado.' });
    }

    // 4. Deleta o livro usando a chave primária composta
    const deleteResult = await query(
      'DELETE FROM livro_genero WHERE id_genero = $1 AND id_livro = $2',
      [id_genero, id_livro]
    );

    // Se a deleção foi bem-sucedida (uma linha afetada), retorna 204
    if (deleteResult.rowCount > 0) {
      res.status(204).send();
    } else {
      // Caso raro, se a verificação inicial passou mas a deleção não afetou nenhuma linha
      res.status(404).json({ error: 'Livro do genero não encontrado para exclusão.' });
    }

  } catch (error) {
    console.error('Erro ao deletar livro do genero:', error);

    // A maioria dos erros aqui será interna, já que a verificação de FK não se aplica
    // diretamente, pois a tabela de junção não tem dependentes.
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

