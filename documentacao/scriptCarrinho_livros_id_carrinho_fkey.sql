-- 1️⃣ Remove a foreign key antiga (que liga carrinho_livros → carrinho)
ALTER TABLE carrinho_livros
DROP CONSTRAINT IF EXISTS carrinho_livros_id_carrinho_fkey;

-- 2️⃣ Cria novamente com ON DELETE CASCADE
ALTER TABLE carrinho_livros
ADD CONSTRAINT carrinho_livros_id_carrinho_fkey
FOREIGN KEY (id_carrinho)
REFERENCES carrinho(id_carrinho)
ON DELETE CASCADE;
