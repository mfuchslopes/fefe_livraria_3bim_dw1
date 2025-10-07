const path = require('path');

// função que vai ser chamada na rota
exports.uploadImagem = (req, res) => {
  console.log("oufdhdfssdofisdf")
  console.log(req.file)
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  }

  return res.status(200).json({
    mensagem: 'Upload realizado com sucesso!',
    arquivo: req.file.filename,
    caminho: `/img/${req.file.filename}`
  });
};
