-- CRIAÇÃO DAS TABELAS
CREATE TABLE pessoa (
    id_pessoa SERIAL PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cep VARCHAR(9),
    endereco VARCHAR(100),
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100)
);

CREATE TABLE autor (
    id_autor SERIAL PRIMARY KEY,
    nome_autor VARCHAR(100) NOT NULL
);

CREATE TABLE genero (
    id_genero SERIAL PRIMARY KEY,
    nome_genero VARCHAR(50) NOT NULL,
    descricao_genero TEXT,
    imagem_genero VARCHAR(255),
	slug_genero VARCHAR(50)
);

CREATE TABLE livro (
    id_livro SERIAL PRIMARY KEY,
    nome_livro VARCHAR(100) NOT NULL,
    descricao_livro TEXT,
    imagem_livro VARCHAR(255),
    preco NUMERIC(10,2),
    quant_estoque INT,
    data_lanc DATE
);

CREATE TABLE livro_autor (
	id_livro INT REFERENCES livro(id_livro),
	id_autor INT REFERENCES autor(id_autor),
	PRIMARY KEY (id_livro, id_autor)
);

CREATE TABLE livro_genero (
    id_livro INT REFERENCES livro(id_livro),
    id_genero INT REFERENCES genero(id_genero),
    PRIMARY KEY (id_livro, id_genero)
);

CREATE TABLE departamento (
    id_dep SERIAL PRIMARY KEY,
    nome_dep VARCHAR(100)
);

CREATE TABLE funcionario (
    id_pessoa INT PRIMARY KEY REFERENCES pessoa(id_pessoa),
    id_dep INT REFERENCES departamento(id_dep),
    id_supervisor INT NULL REFERENCES funcionario(id_pessoa)
);

CREATE TABLE cliente (
    id_pessoa INT PRIMARY KEY REFERENCES pessoa(id_pessoa)
);

CREATE TABLE carrinho (
    id_carrinho SERIAL PRIMARY KEY,
    data_carrinho DATE,
    id_pessoa INT REFERENCES pessoa(id_pessoa)
);

CREATE TABLE carrinho_livros (
    id_carrinho INT REFERENCES carrinho(id_carrinho),
    id_livro INT REFERENCES livro(id_livro),
    quant_livro INT,
    PRIMARY KEY (id_carrinho, id_livro)
);

CREATE TABLE pagamento (
    id_carrinho INT PRIMARY KEY REFERENCES carrinho(id_carrinho),
    data_pagamento DATE,
    valor_pag NUMERIC(10,2)
);

CREATE TABLE promocao (
    id_prom SERIAL PRIMARY KEY,
    nome_prom VARCHAR(100),
    imagem_prom VARCHAR(255),
    descricao_prom TEXT
);

CREATE TABLE livro_prom (
    id_livro INT REFERENCES livro(id_livro),
    id_prom INT REFERENCES promocao(id_prom),
    desconto_prom NUMERIC(5,2),
    PRIMARY KEY (id_livro, id_prom)
);

CREATE TABLE cupom (
    nome_cupom VARCHAR(50) PRIMARY KEY,
    desconto_cupom NUMERIC(5,2)
);

CREATE TABLE carrinho_cupom (
    id_carrinho INT REFERENCES carrinho(id_carrinho),
    nome_cupom VARCHAR(50) REFERENCES cupom(nome_cupom),
    PRIMARY KEY (id_carrinho, nome_cupom)
);

-- =============================
-- POPULAÇÃO DE TABELAS
-- =============================

-- Pessoa
-- Pessoas (20 registros)
INSERT INTO pessoa (cpf, cep, endereco, nome, email, senha) VALUES
('111.111.111-11','87000-000','Rua A, 100','Ana Silva','ana@email.com','123'),
('222.222.222-22','87000-001','Rua B, 200','Bruno Souza','bruno@email.com','123'),
('333.333.333-33','87000-002','Rua C, 300','Carla Lima','carla@email.com','123'),
('444.444.444-44','87000-003','Rua D, 400','Diego Alves','diego@email.com','123'),
('555.555.555-55','87000-004','Rua E, 500','Elisa Costa','elisa@email.com','123'),
('666.666.666-66','87000-005','Rua F, 600','Fernando Rocha','fernando@email.com','123'),
('777.777.777-77','87000-006','Rua G, 700','Gabriela Ramos','gabriela@email.com','123'),
('888.888.888-88','87000-007','Rua H, 800','Henrique Dias','henrique@email.com','123'),
('999.999.999-99','87000-008','Rua I, 900','Isabela Martins','isabela@email.com','123'),
('000.000.000-00','87000-009','Rua J, 1000','João Pedro','joao@email.com','123'),

('111.222.333-44','87010-000','Rua K, 1100','Kelly Moura','kelly@email.com','123'),
('222.333.444-55','87010-001','Rua L, 1200','Lucas Pinto','lucas@email.com','123'),
('333.444.555-66','87010-002','Rua M, 1300','Mariana Lopes','mariana@email.com','123'),
('444.555.666-77','87010-003','Rua N, 1400','Nicolas Barros','nicolas@email.com','123'),
('555.666.777-88','87010-004','Rua O, 1500','Olívia Santos','olivia@email.com','123'),
('666.777.888-99','87010-005','Rua P, 1600','Paulo Henrique','paulo@email.com','123'),
('777.888.999-00','87010-006','Rua Q, 1700','Quitéria Moraes','quiteria@email.com','123'),
('888.999.000-11','87010-007','Rua R, 1800','Rafael Gomes','rafael@email.com','123'),
('999.000.111-22','87010-008','Rua S, 1900','Sofia Almeida','sofia@email.com','123'),
('000.111.222-33','87010-009','Rua T, 2000','Tiago Fernandes','tiago@email.com','123');

-- Autor (10 autores que são pessoas de 1 a 10)
INSERT INTO autor (nome_autor) VALUES
('Machado de Assis'),
('Clarice Lispector'),
('Jorge Amado'),
('Paulo Coelho'),
('Monteiro Lobato'),
('José de Alencar'),
('Cecília Meireles'),
('Carlos Drummond'),
('Graciliano Ramos'),
('Manuel Bandeira');

-- Genero
INSERT INTO genero (nome_genero, descricao_genero, imagem_genero, slug_genero) VALUES
('Romance','Histórias românticas','romance.jpg','romance'),
('Suspense','Histórias de mistério','suspense.jpg','suspense'),
('Fantasia','Mundos mágicos','fantasia.jpg','fantasia'),
('Clássico','Obras clássicas','classico.jpg','classico'),
('Poesia','Obras poéticas','poesia.jpg','poesia'),
('Drama','Histórias dramáticas','drama.jpg','drama'),
('Aventura','Exploração e ação','aventura.jpg','aventura'),
('Terror','Histórias assustadoras','terror.jpg','terror'),
('Ficção Científica','Tecnologia e futuro','sci-fi.jpg','sci-fi'),
('Biografia','Histórias de vida','bio.jpg','biografia');

-- Livro
INSERT INTO livro (nome_livro, descricao_livro, imagem_livro, preco, quant_estoque, data_lanc) VALUES
('Dom Casmurro','Clássico brasileiro','domcasmurro.jpg',39.90,10,'1899-01-01'),
('A Hora da Estrela','Romance moderno','estrela.jpg',29.90,5,'1977-01-01'),
('Capitães da Areia','Romance social','capitaes.jpg',34.90,8,'1937-01-01'),
('O Alquimista','Romance espiritual','alquimista.jpg',25.90,12,'1988-01-01'),
('Sítio do Picapau Amarelo','Infantil','sitio.jpg',49.90,20,'1939-01-01'),
('Iracema','Clássico romântico','iracema.jpg',19.90,7,'1865-01-01'),
('Romanceiro da Inconfidência','Poesia histórica','inconfidencia.jpg',22.90,6,'1953-01-01'),
('Alguma Poesia','Coletânea','algumapoesia.jpg',18.90,9,'1930-01-01'),
('Vidas Secas','Drama sertanejo','vidas.jpg',32.90,11,'1938-01-01'),
('Libertinagem','Poesia moderna','libertinagem.jpg',21.90,10,'1930-01-01');

-- Livro_Genero (5 registros)
INSERT INTO livro_genero VALUES
(1,4),(2,1),(3,1),(4,1),(5,3);

-- Departamento
INSERT INTO departamento (nome_dep) VALUES
('Vendas'),('Estoque'),('Marketing'),('TI'),('Financeiro'),
('Atendimento'),('RH'),('Compras'),('Logística'),('Administração');

-- Funcionários (primeiras 10 pessoas)
INSERT INTO funcionario (id_pessoa, id_dep, id_supervisor) VALUES
(1,1,NULL),
(2,2,1),
(3,3,1),
(4,4,2),
(5,5,3),
(6,6,4),
(7,7,5),
(8,8,6),
(9,9,7),
(10,10,8);

-- Clientes (últimas 10 pessoas)
INSERT INTO cliente (id_pessoa) VALUES
(11),(12),(13),(14),(15),(16),(17),(18),(19),(20);

-- Carrinho (10)
INSERT INTO carrinho (data_carrinho, id_pessoa) VALUES
('2025-09-01',1),
('2025-09-02',12),
('2025-09-03',3),
('2025-09-04',14),
('2025-09-05',5),
('2025-09-06',16),
('2025-09-07',7),
('2025-09-08',18),
('2025-09-09',9),
('2025-09-10',20);

-- Carrinho_Livros (5 relações)
INSERT INTO carrinho_livros VALUES
(1,1,2),(2,2,1),(3,3,1),(4,4,3),(5,5,1);

-- Pagamento (10)
INSERT INTO pagamento VALUES
(1,'2025-09-01',79.80),
(2,'2025-09-02',29.90),
(3,'2025-09-03',34.90),
(4,'2025-09-04',77.70),
(5,'2025-09-05',49.90),
(6,'2025-09-06',19.90),
(7,'2025-09-07',59.90),
(8,'2025-09-08',32.90),
(9,'2025-09-09',44.90),
(10,'2025-09-10',99.90);

-- Promoção (10)
INSERT INTO promocao (nome_prom, imagem_prom, descricao_prom) VALUES
('Promo Verão','promo1.jpg','Descontos de verão'),
('Promo Inverno','promo2.jpg','Descontos de inverno'),
('Black Friday','promo3.jpg','Mega descontos'),
('Natal','promo4.jpg','Promoções de Natal'),
('Aniversário','promo5.jpg','Promoções especiais'),
('Volta às aulas','promo6.jpg','Descontos para estudantes'),
('Literatura Brasileira','promo7.jpg','Descontos em clássicos'),
('Semana do Cliente','promo8.jpg','Descontos especiais'),
('Dia das Crianças','promo9.jpg','Promoções infantis'),
('Férias','promo10.jpg','Descontos de férias');

-- Livro_Prom (5 relações)
INSERT INTO livro_prom VALUES
(1,1,10),(2,2,15),(3,3,20),(4,4,25),(5,5,30);

-- Cupom (10)
INSERT INTO cupom VALUES
('DESC10',10),('DESC15',15),('DESC20',20),('FRETEGRATIS',0),('VIP30',30),
('WELCOME5',5),('PROMO25',25),('BOOKLOVER',12),('EXTRA50',50),('CASHBACK',8);

-- Carrinho_Cupom (5 relações)
INSERT INTO carrinho_cupom VALUES
(1,'DESC10'),
(2,'DESC15'),
(3,'DESC20'),
(4,'VIP30'),
(5,'WELCOME5');

