DROP DATABASE IF EXISTS ampara_social;
CREATE DATABASE ampara_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ampara_social;

CREATE TABLE unidades (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('CRAS', 'CREAS', 'CAPS') NOT NULL
) ENGINE = InnoDB;

CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    unidade_id INT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    funcao VARCHAR(60) NOT NULL,
    UNIQUE KEY uk_usuarios_email (email),
    CONSTRAINT fk_usuarios_unidade FOREIGN KEY (unidade_id) REFERENCES unidades (id)
) ENGINE = InnoDB;

CREATE TABLE familias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    endereco VARCHAR(150) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    telefone VARCHAR(20) NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE municipes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    familia_id INT UNSIGNED NOT NULL,
    cpf CHAR(11) NOT NULL,
    nis CHAR(11) NULL,
    nome VARCHAR(120) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo VARCHAR(30) NOT NULL,
    parentesco VARCHAR(30) NOT NULL,
    telefone VARCHAR(20) NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_municipes_cpf (cpf),
    UNIQUE KEY uk_municipes_nis (nis),
    CONSTRAINT fk_municipes_familia FOREIGN KEY (familia_id) REFERENCES familias (id)
) ENGINE = InnoDB;

CREATE TABLE dados_socioeconomicos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipe_id INT UNSIGNED NOT NULL,
    renda_mensal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    escolaridade VARCHAR(60) NOT NULL,
    ocupacao VARCHAR(80) NOT NULL,
    tipo_moradia VARCHAR(30) NOT NULL,
    UNIQUE KEY uk_socioeconomicos_municipe (municipe_id),
    CONSTRAINT fk_socioeconomicos_municipe FOREIGN KEY (municipe_id) REFERENCES municipes (id)
) ENGINE = InnoDB;

CREATE TABLE beneficios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    UNIQUE KEY uk_beneficios_nome (nome)
) ENGINE = InnoDB;

CREATE TABLE entregas_beneficio (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipe_id INT UNSIGNED NOT NULL,
    beneficio_id INT UNSIGNED NOT NULL,
    unidade_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL,
    data_entrega DATE NOT NULL,
    CONSTRAINT fk_entregas_municipe FOREIGN KEY (municipe_id) REFERENCES municipes (id),
    CONSTRAINT fk_entregas_beneficio FOREIGN KEY (beneficio_id) REFERENCES beneficios (id),
    CONSTRAINT fk_entregas_unidade FOREIGN KEY (unidade_id) REFERENCES unidades (id),
    CONSTRAINT fk_entregas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE = InnoDB;

CREATE TABLE atendimentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipe_id INT UNSIGNED NOT NULL,
    unidade_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    tipo VARCHAR(60) NOT NULL,
    descricao TEXT NOT NULL,
    data_atendimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atendimentos_municipe FOREIGN KEY (municipe_id) REFERENCES municipes (id),
    CONSTRAINT fk_atendimentos_unidade FOREIGN KEY (unidade_id) REFERENCES unidades (id),
    CONSTRAINT fk_atendimentos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE = InnoDB;

INSERT INTO unidades (id, nome, tipo) VALUES
(1, 'CRAS Centro', 'CRAS'),
(2, 'CREAS Norte', 'CREAS'),
(3, 'CAPS II', 'CAPS');

INSERT INTO usuarios (id, unidade_id, nome, email, senha_hash, funcao) VALUES
(1, 1, 'Ana Ribeiro', 'ana.ribeiro@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'Assistente social'),
(2, 3, 'Marcos Lima', 'marcos.lima@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'Psicólogo'),
(3, 2, 'Juliana Prado', 'juliana.prado@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'Coordenadora');

INSERT INTO familias (id, endereco, bairro, telefone) VALUES
(1, 'Rua das Acácias, 80', 'Jardim Aurora', '(18) 99712-4500'),
(2, 'Rua dos Girassóis, 215', 'Vila das Flores', '(18) 99712-4502'),
(3, 'Avenida do Sol, 1040', 'Parque Horizonte', '(18) 99712-4504'),
(4, 'Rua dos Ipês, 33', 'Bosque Novo', '(18) 99712-4506'),
(5, 'Rua Aroeira, 412', 'Residencial Ipê', '(18) 99712-4508'),
(6, 'Rua São Francisco, 9', 'Vila Esperança', '(18) 99712-4510'),
(7, 'Rua do Horizonte, 560', 'Colinas do Sol', '(18) 99712-4513'),
(8, 'Rua das Acácias, 191', 'Jardim Aurora', '(18) 99712-4515'),
(9, 'Rua das Pitangueiras, 74', 'Recanto Verde', '(18) 99712-4517');

INSERT INTO municipes (id, familia_id, cpf, nis, nome, data_nascimento, sexo, parentesco, telefone) VALUES
(1, 1, '12345678909', '16400234567', 'Maria da Silva Santos', '1985-04-18', 'Feminino', 'Responsável familiar', '(18) 99712-4500'),
(2, 1, '52998224725', '16400234568', 'João Pedro Santos', '2008-09-02', 'Masculino', 'Filho(a)', '(18) 99712-4501'),
(3, 2, '11144477735', '16400234569', 'Lúcia Helena Costa', '1964-01-22', 'Feminino', 'Responsável familiar', '(18) 99712-4502'),
(4, 2, '39053344705', '16400234570', 'Rafael Costa', '1991-11-06', 'Masculino', 'Filho(a)', '(18) 99712-4503'),
(5, 3, '86288366757', '16400234571', 'Paula Nascimento', '1997-07-30', 'Feminino', 'Responsável familiar', '(18) 99712-4504'),
(6, 3, '01234567890', NULL, 'Enzo Nascimento', '2019-02-14', 'Masculino', 'Filho(a)', NULL),
(7, 4, '15350946056', '16400234573', 'Antônio Ferreira', '1957-12-03', 'Masculino', 'Responsável familiar', '(18) 99712-4506'),
(8, 4, '25634423031', '16400234574', 'Célia Ferreira', '1960-08-19', 'Feminino', 'Cônjuge', '(18) 99712-4507'),
(9, 5, '47305927007', '16400234575', 'Bruna Oliveira', '1988-03-11', 'Feminino', 'Responsável familiar', '(18) 99712-4508'),
(10, 5, '17422403055', '16400234576', 'Caio Oliveira', '2012-05-28', 'Masculino', 'Filho(a)', NULL),
(11, 6, '24971563792', '16400234577', 'Diego Martins', '1983-06-17', 'Masculino', 'Responsável familiar', '(18) 99712-4510'),
(12, 6, '01217489606', '16400234578', 'Sônia Martins', '1986-10-09', 'Feminino', 'Cônjuge', '(18) 99712-4511'),
(13, 6, '92688530003', '16400234579', 'Gabriel Martins', '2015-01-25', 'Masculino', 'Filho(a)', NULL),
(14, 7, '98765432100', '16400234580', 'Neide Souza', '1974-04-08', 'Feminino', 'Responsável familiar', '(18) 99712-4513'),
(15, 7, '16899535009', '16400234581', 'Mauro Souza', '1970-09-16', 'Masculino', 'Cônjuge', '(18) 99712-4514'),
(16, 8, '74697131401', '16400234582', 'Renata Alves', '1993-12-21', 'Feminino', 'Responsável familiar', '(18) 99712-4515'),
(17, 8, '07968841020', NULL, 'Luiz Alves', '2017-07-07', 'Masculino', 'Filho(a)', NULL),
(18, 9, '03375755090', '16400234584', 'Edna Rocha', '1952-02-27', 'Feminino', 'Responsável familiar', '(18) 99712-4517'),
(19, 9, '03104132062', '16400234585', 'Fábio Rocha', '1978-05-13', 'Masculino', 'Filho(a)', '(18) 99712-4518'),
(20, 9, '27720517067', '16400234586', 'Aline Rocha', '2002-08-31', 'Feminino', 'Outro', '(18) 99712-4519');

INSERT INTO dados_socioeconomicos (municipe_id, renda_mensal, escolaridade, ocupacao, tipo_moradia) VALUES
(1, 850.00, 'Ensino fundamental incompleto', 'Trabalhadora autônoma', 'Alugada'),
(2, 0.00, 'Ensino fundamental completo', 'Estudante', 'Alugada'),
(3, 1412.00, 'Ensino fundamental completo', 'Aposentada', 'Própria'),
(4, 1850.00, 'Ensino médio completo', 'Auxiliar de serviços gerais', 'Própria'),
(5, 0.00, 'Ensino médio completo', 'Desempregada', 'Cedida'),
(6, 0.00, 'Ensino fundamental incompleto', 'Estudante', 'Cedida'),
(7, 1412.00, 'Não alfabetizado', 'Aposentado', 'Própria'),
(8, 0.00, 'Ensino fundamental incompleto', 'Do lar', 'Própria'),
(9, 920.00, 'Ensino médio completo', 'Diarista', 'Alugada'),
(10, 0.00, 'Ensino fundamental incompleto', 'Estudante', 'Alugada'),
(11, 1600.00, 'Ensino fundamental completo', 'Pedreiro', 'Ocupação'),
(12, 0.00, 'Ensino fundamental completo', 'Desempregada', 'Ocupação'),
(13, 0.00, 'Ensino fundamental incompleto', 'Estudante', 'Ocupação'),
(14, 1412.00, 'Ensino médio completo', 'Cozinheira', 'Alugada'),
(15, 700.00, 'Ensino fundamental incompleto', 'Catador de recicláveis', 'Alugada'),
(16, 1200.00, 'Ensino superior', 'Atendente', 'Cedida'),
(17, 0.00, 'Ensino fundamental incompleto', 'Estudante', 'Cedida'),
(18, 1412.00, 'Não alfabetizado', 'Aposentada', 'Própria'),
(19, 0.00, 'Ensino fundamental completo', 'Desempregado', 'Própria'),
(20, 1100.00, 'Ensino médio completo', 'Vendedora', 'Própria');

INSERT INTO beneficios (id, nome) VALUES
(1, 'Cesta básica'),
(2, 'Auxílio aluguel'),
(3, 'Kit enxoval'),
(4, 'Vale-transporte social');

INSERT INTO entregas_beneficio (municipe_id, beneficio_id, unidade_id, usuario_id, quantidade, data_entrega) VALUES
(1, 1, 1, 1, 1, CURDATE() - INTERVAL 14 DAY),
(1, 4, 3, 2, 8, CURDATE() - INTERVAL 28 DAY),
(3, 2, 1, 1, 1, CURDATE() - INTERVAL 19 DAY),
(5, 3, 1, 1, 1, CURDATE() - INTERVAL 11 DAY),
(8, 1, 2, 3, 2, CURDATE() - INTERVAL 7 DAY),
(11, 4, 3, 2, 12, CURDATE() - INTERVAL 4 DAY);

INSERT INTO atendimentos (municipe_id, unidade_id, usuario_id, tipo, descricao, data_atendimento) VALUES
(1, 1, 1, 'Acompanhamento familiar', 'Família acolhida para atualização do plano de acompanhamento. Maria relata melhora na organização financeira e solicitou orientação sobre benefício eventual.', TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '10:30:00')),
(1, 2, 3, 'Escuta especializada', 'Realizada escuta protegida e pactuadas medidas de acompanhamento. Mantido contato com a rede de proteção conforme plano individual.', TIMESTAMP(CURDATE() - INTERVAL 9 DAY, '14:00:00')),
(1, 3, 2, 'Atendimento individual', 'Usuária compareceu ao atendimento individual. Apresenta adesão ao projeto terapêutico e evolução estável. Retorno agendado.', TIMESTAMP(CURDATE() - INTERVAL 22 DAY, '09:15:00')),
(2, 1, 1, 'Atendimento individual', 'Orientações prestadas sobre documentação e acesso a atividades de convivência no território.', TIMESTAMP(CURDATE() - INTERVAL 3 DAY, '11:20:00')),
(3, 3, 2, 'Acolhimento', 'Acolhimento realizado com participação de familiar. Caso discutido em reunião de equipe.', TIMESTAMP(CURDATE() - INTERVAL 5 DAY, '15:40:00')),
(4, 2, 3, 'Visita domiciliar', 'Visita realizada para verificação das condições de proteção e fortalecimento dos vínculos.', TIMESTAMP(CURDATE() - INTERVAL 8 DAY, '08:50:00'));
