-- 1️⃣ Remove a foreign key antiga (que liga livro_genero → genero)
ALTER TABLE livro_genero
DROP CONSTRAINT IF EXISTS livro_genero_id_genero_fkey;

-- 2️⃣ Cria novamente com ON DELETE CASCADE
ALTER TABLE livro_genero
ADD CONSTRAINT livro_genero_id_genero_fkey
FOREIGN KEY (id_genero)
REFERENCES genero(id_genero)
ON DELETE CASCADE;