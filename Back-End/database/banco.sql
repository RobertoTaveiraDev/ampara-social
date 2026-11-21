DROP DATABASE IF EXISTS ampara_social;
CREATE DATABASE ampara_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ampara_social;

CREATE TABLE unidades (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('CRAS', 'CREAS', 'CAPS') NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    unidade_id INT UNSIGNED NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cargo ENUM('tecnico', 'coordenador', 'gestor', 'admin') NOT NULL,
    funcao VARCHAR(60) NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE KEY uk_usuarios_email (email),
    CONSTRAINT fk_usuarios_unidade FOREIGN KEY (unidade_id) REFERENCES unidades (id)
) ENGINE = InnoDB;

CREATE TABLE tentativas_login (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    sucesso TINYINT(1) NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY ix_tentativas_email_data (email, data_hora),
    KEY ix_tentativas_ip_data (ip, data_hora)
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
    descricao VARCHAR(255) NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
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
    evolucao TEXT NOT NULL,
    data_atendimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atendimentos_municipe FOREIGN KEY (municipe_id) REFERENCES municipes (id),
    CONSTRAINT fk_atendimentos_unidade FOREIGN KEY (unidade_id) REFERENCES unidades (id),
    CONSTRAINT fk_atendimentos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE = InnoDB;

CREATE TABLE encaminhamentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipe_id INT UNSIGNED NOT NULL,
    unidade_origem_id INT UNSIGNED NOT NULL,
    unidade_destino_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    motivo TEXT NOT NULL,
    prioridade ENUM('baixa', 'media', 'alta') NOT NULL,
    status ENUM('aguardando', 'em_atendimento', 'finalizado') NOT NULL DEFAULT 'aguardando',
    prazo DATE NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aceito_em DATETIME NULL,
    KEY ix_encaminhamentos_destino_status (unidade_destino_id, status),
    CONSTRAINT fk_encaminhamentos_municipe FOREIGN KEY (municipe_id) REFERENCES municipes (id),
    CONSTRAINT fk_encaminhamentos_origem FOREIGN KEY (unidade_origem_id) REFERENCES unidades (id),
    CONSTRAINT fk_encaminhamentos_destino FOREIGN KEY (unidade_destino_id) REFERENCES unidades (id),
    CONSTRAINT fk_encaminhamentos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE = InnoDB;

CREATE TABLE auditoria (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    municipe_id INT UNSIGNED NULL,
    acao VARCHAR(60) NOT NULL,
    alvo VARCHAR(150) NULL,
    ip VARCHAR(45) NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY ix_auditoria_data_hora (data_hora),
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT fk_auditoria_municipe FOREIGN KEY (municipe_id) REFERENCES municipes (id)
) ENGINE = InnoDB;

INSERT INTO unidades (id, nome, tipo, endereco, telefone) VALUES
(1, 'CRAS Centro', 'CRAS', 'Rua das Palmeiras, 120 - Centro', '(18) 3500-1200'),
(2, 'CREAS Norte', 'CREAS', 'Rua Boa Vista, 455 - Centro', '(18) 3500-1310'),
(3, 'CAPS II', 'CAPS', 'Rua Dr. Nogueira, 78 - Centro', '(18) 3500-1420');

INSERT INTO usuarios (id, unidade_id, nome, email, senha_hash, cargo, funcao, ativo) VALUES
(1, 1, 'Ana Ribeiro', 'ana.ribeiro@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'tecnico', 'Assistente social', 1),
(2, 3, 'Marcos Lima', 'marcos.lima@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'tecnico', 'Psicólogo', 1),
(3, 2, 'Juliana Prado', 'juliana.prado@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'coordenador', 'Coordenadora', 1),
(4, NULL, 'Carlos Mendes', 'carlos.mendes@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'gestor', 'Gestor municipal', 1),
(5, NULL, 'Admin do Sistema', 'admin@ampara.gov.br', '$2y$10$LDvH94i.5D48sO.YaDK1X.GYFqZSjXQaIg62I16KimHkXsC7qk60C', 'admin', 'Administrador', 1);

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

INSERT INTO beneficios (id, nome, descricao, ativo) VALUES
(1, 'Cesta básica', 'Cesta de alimentos para famílias em insegurança alimentar.', 1),
(2, 'Auxílio aluguel', 'Apoio temporário para pagamento de aluguel em situação de vulnerabilidade.', 1),
(3, 'Kit enxoval', 'Kit com itens para recém-nascidos de famílias acompanhadas.', 1),
(4, 'Vale-transporte social', 'Passagens de ônibus para acesso a serviços da rede.', 1);

INSERT INTO entregas_beneficio (municipe_id, beneficio_id, unidade_id, usuario_id, quantidade, data_entrega) VALUES
(1, 1, 1, 1, 1, CURDATE() - INTERVAL 14 DAY),
(1, 4, 3, 2, 8, CURDATE() - INTERVAL 28 DAY),
(3, 2, 1, 1, 1, CURDATE() - INTERVAL 19 DAY),
(5, 3, 1, 1, 1, CURDATE() - INTERVAL 11 DAY),
(8, 1, 2, 3, 2, CURDATE() - INTERVAL 7 DAY),
(11, 4, 3, 2, 12, CURDATE() - INTERVAL 4 DAY);

INSERT INTO atendimentos (municipe_id, unidade_id, usuario_id, tipo, evolucao, data_atendimento) VALUES
(1, 1, 1, 'Acompanhamento familiar', 'Família acolhida para atualização do plano de acompanhamento. Maria relata melhora na organização financeira e solicitou orientação sobre benefício eventual.', TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '10:30:00')),
(1, 2, 3, 'Escuta especializada', 'Realizada escuta protegida e pactuadas medidas de acompanhamento. Mantido contato com a rede de proteção conforme plano individual.', TIMESTAMP(CURDATE() - INTERVAL 9 DAY, '14:00:00')),
(1, 3, 2, 'Atendimento individual', 'Usuária compareceu ao atendimento individual. Apresenta adesão ao projeto terapêutico e evolução estável. Retorno agendado.', TIMESTAMP(CURDATE() - INTERVAL 22 DAY, '09:15:00')),
(2, 1, 1, 'Atendimento individual', 'Orientações prestadas sobre documentação e acesso a atividades de convivência no território.', TIMESTAMP(CURDATE() - INTERVAL 3 DAY, '11:20:00')),
(3, 3, 2, 'Acolhimento', 'Acolhimento realizado com participação de familiar. Caso discutido em reunião de equipe.', TIMESTAMP(CURDATE() - INTERVAL 5 DAY, '15:40:00')),
(4, 2, 3, 'Visita domiciliar', 'Visita realizada para verificação das condições de proteção e fortalecimento dos vínculos.', TIMESTAMP(CURDATE() - INTERVAL 8 DAY, '08:50:00'));

INSERT INTO encaminhamentos (municipe_id, unidade_origem_id, unidade_destino_id, usuario_id, motivo, prioridade, status, prazo, criado_em, aceito_em) VALUES
(1, 1, 3, 1, 'Avaliação e acompanhamento em saúde mental', 'alta', 'aguardando', CURDATE() - INTERVAL 4 DAY, TIMESTAMP(CURDATE() - INTERVAL 10 DAY, '10:45:00'), NULL),
(4, 1, 2, 1, 'Suspeita de violação de direitos', 'alta', 'em_atendimento', CURDATE() - INTERVAL 6 DAY, TIMESTAMP(CURDATE() - INTERVAL 12 DAY, '09:10:00'), TIMESTAMP(CURDATE() - INTERVAL 9 DAY, '13:30:00')),
(3, 3, 1, 2, 'Avaliação para benefício eventual', 'media', 'aguardando', CURDATE() + INTERVAL 8 DAY, TIMESTAMP(CURDATE() - INTERVAL 3 DAY, '16:05:00'), NULL),
(6, 2, 1, 3, 'Inclusão em serviço de convivência', 'baixa', 'em_atendimento', CURDATE() + INTERVAL 5 DAY, TIMESTAMP(CURDATE() - INTERVAL 6 DAY, '16:45:00'), TIMESTAMP(CURDATE() - INTERVAL 4 DAY, '10:00:00')),
(8, 1, 2, 1, 'Acompanhamento familiar especializado', 'media', 'aguardando', CURDATE() - INTERVAL 8 DAY, TIMESTAMP(CURDATE() - INTERVAL 15 DAY, '11:00:00'), NULL),
(11, 2, 3, 3, 'Acolhimento psicológico prioritário', 'alta', 'em_atendimento', CURDATE(), TIMESTAMP(CURDATE() - INTERVAL 6 DAY, '14:20:00'), TIMESTAMP(CURDATE() - INTERVAL 5 DAY, '08:40:00')),
(14, 3, 1, 2, 'Atualização do Cadastro Único', 'baixa', 'aguardando', CURDATE() + INTERVAL 13 DAY, TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '09:30:00'), NULL),
(16, 1, 3, 1, 'Avaliação pela equipe multidisciplinar', 'media', 'finalizado', CURDATE() - INTERVAL 12 DAY, TIMESTAMP(CURDATE() - INTERVAL 20 DAY, '15:15:00'), TIMESTAMP(CURDATE() - INTERVAL 18 DAY, '09:00:00')),
(18, 2, 1, 3, 'Acesso a benefício eventual', 'media', 'finalizado', CURDATE() - INTERVAL 10 DAY, TIMESTAMP(CURDATE() - INTERVAL 17 DAY, '10:20:00'), TIMESTAMP(CURDATE() - INTERVAL 15 DAY, '14:10:00')),
(20, 1, 2, 1, 'Acompanhamento protetivo continuado', 'alta', 'aguardando', CURDATE() + INTERVAL 10 DAY, TIMESTAMP(CURDATE() - INTERVAL 1 DAY, '17:00:00'), NULL);

INSERT INTO auditoria (usuario_id, municipe_id, acao, alvo, ip, data_hora) VALUES
(2, 11, 'Entregou benefício', 'Vale-transporte social', '10.24.10.14', TIMESTAMP(CURDATE() - INTERVAL 4 DAY, '11:22:00')),
(3, 9, 'Abriu prontuário', 'Prontuário', '10.24.12.08', TIMESTAMP(CURDATE() - INTERVAL 4 DAY, '14:36:00')),
(3, 6, 'Encaminhou caso', 'Encaminhamento para CRAS Centro', '10.24.12.08', TIMESTAMP(CURDATE() - INTERVAL 6 DAY, '16:45:00')),
(1, 5, 'Entregou benefício', 'Kit enxoval', '10.24.8.31', TIMESTAMP(CURDATE() - INTERVAL 11 DAY, '15:07:00')),
(2, 3, 'Abriu prontuário', 'Prontuário', '10.24.10.14', TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '09:12:00')),
(1, 1, 'Registrou atendimento', 'Acompanhamento familiar', '10.24.8.31', TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '10:31:00')),
(1, 1, 'Abriu prontuário', 'Prontuário', '10.24.8.31', TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '10:42:00'));
