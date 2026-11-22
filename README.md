# AMPARA SOCIAL

Atendimento Municipal, Proteção e Acompanhamento da Rede de Assistência.

Sistema que integra as unidades da assistência social do município (CRAS, CREAS e CAPS) em um cadastro único do cidadão. Cada unidade registra os seus atendimentos, e o servidor só enxerga os atendimentos da unidade em que trabalha.

Projeto B2 da disciplina Web Avançada (UniSALESIANO).

| Integrante | RA |
|---|---|
| Roberto Alves Taveira Neto | 221366 |
| Felipe Correia de Souza Prado | 221512 |

## O que o sistema faz

- **Login com JWT.** Toda requisição, exceto o login, leva o token no cabeçalho `Authorization: Bearer <token>`. Sem token, ou com token inválido, a API responde 401.
- **Dois perfis:**
  - **Servidor** (trabalha em uma unidade): cadastra e edita munícipes e famílias, e registra atendimentos e entregas de benefícios.
  - **Gestor geral** (sem unidade): cadastra usuários e unidades.

  A API responde 403 quando um perfil tenta usar uma rota do outro.
- **Cadastro único de munícipes**, compartilhado entre as unidades, com dados pessoais, família e dados socioeconômicos. O CPF é validado pelos dígitos verificadores e não pode se repetir.
- **Atendimentos sigilosos:** cada unidade só vê, edita e exclui os próprios atendimentos. O filtro é feito na consulta do back-end.
- **Entregas de benefícios** visíveis para todas as unidades. Só a unidade que registrou pode editar ou excluir.
- **Exclusões protegidas:** quem tem histórico vinculado não pode ser excluído (a API responde 409). Isso vale para munícipe com atendimentos ou entregas, família com munícipes, unidade com usuários e usuário com registros.
- **Página Quem Somos**, com nome e RA dos integrantes.

## Tecnologias

| Parte | Tecnologias |
|---|---|
| Back-End | PHP, Laminas MVC, laminas-db (`TableGateway`), firebase/php-jwt e Composer |
| Front-End | React, Vite, react-router-dom e lucide-react, em JavaScript |
| Banco | MySQL (ou MariaDB), com 8 tabelas |

**Relações do banco:**
- **1:1** entre `municipes` e `dados_socioeconomicos` (o `municipe_id` é único);
- **1:N** entre `familias` e `municipes`: cada munícipe pertence a uma família (`municipes.familia_id`), e uma família pode ter vários munícipes;
- **N:N** entre `municipes` e `beneficios`, pela tabela `entregas_beneficio`.

## Pastas

- `Back-End/`: API em PHP com Laminas MVC.
  - `database/banco.sql`: script que cria o banco, as tabelas e os dados de exemplo.
  - `module/`: um módulo por assunto:
    - `Comum`: respostas JSON, erros e CORS;
    - `Seguranca`: login e token;
    - `Municipe`;
    - `Atendimento`;
    - `Beneficio`;
    - `Gestao`.
- `Front-End/`: interface em React.
  - `src/api/cliente.js`: o único lugar que chama a API e envia o token.
  - `src/paginas/`: as telas.
- `video.txt`: link do vídeo com o sistema funcionando.

## Requisitos

- **PHP 8.1, 8.2 ou 8.3**, com a extensão `pdo_mysql` habilitada. Com PHP 8.4, veja "Problemas comuns".
- **Composer 2.**
- **MySQL 8** (ou MariaDB 10.5 ou mais recente) e uma ferramenta CASE de banco de dados, como HeidiSQL, MySQL Workbench, DBeaver ou phpMyAdmin. A linha de comando `mysql` também serve.
- **Node.js 20.19 ou mais recente**, com o npm.

## Como rodar

### 1. Banco de dados

Abra o arquivo `Back-End/database/banco.sql` na sua ferramenta CASE de banco de dados e execute o script inteiro. Ele apaga o banco `ampara_social` (se já existir) e cria de novo, com as tabelas e os dados de exemplo.

Para voltar os dados de exemplo ao estado original, basta rodar o script de novo.

### 2. Back-End

Dentro da pasta `Back-End`, crie o arquivo de configuração local a partir do modelo:

```bash
cd Back-End
cp config/autoload/local.php.dist config/autoload/local.php
```

No Prompt de Comando do Windows, use `copy config\autoload\local.php.dist config\autoload\local.php`.

Abra o `config/autoload/local.php` e preencha:

- `db.username` e `db.password`: o usuário e a senha do seu MySQL;
- `jwt.chave`: uma chave secreta com pelo menos 32 caracteres. Para gerar uma aleatória:

  ```bash
  php -r "echo bin2hex(random_bytes(32));"
  ```

O endereço e o nome do banco (`localhost` e `ampara_social`) ficam em `config/autoload/global.php`.

Depois, instale as dependências e suba a API:

```bash
composer install
composer development-enable
composer serve
```

A API fica em `http://localhost:8080/api`. O `development-enable` só precisa ser rodado uma vez: ele desliga o cache de configuração do Laminas durante o desenvolvimento.

### 3. Front-End

Em outro terminal, dentro da pasta `Front-End`:

```bash
cd Front-End
cp .env.exemplo .env
npm install
npm run dev
```

No Prompt de Comando do Windows, use `copy .env.exemplo .env`.

O `.env` aponta o front para a API (`VITE_API_URL=http://localhost:8080/api`). Abra `http://localhost:5173` no navegador.

## Usuários de demonstração

O `banco.sql` cria estes usuários fictícios. Todos usam a senha `ampara123`.

| Usuário | E-mail | Perfil | Unidade |
|---|---|---|---|
| Ana Ribeiro | ana.ribeiro@ampara.gov.br | Servidor | CRAS Centro |
| Marcos Lima | marcos.lima@ampara.gov.br | Servidor | CAPS II |
| Juliana Prado | juliana.prado@ampara.gov.br | Servidor | CREAS Norte |
| Carlos Mendes | carlos.mendes@ampara.gov.br | Gestor geral | — |

Para ver o sigilo dos atendimentos, abra a munícipe **Maria da Silva Santos** com usuários de unidades diferentes: cada um vê só o atendimento da própria unidade.

## Principais rotas da API

| Rota | Perfil | O que faz |
|---|---|---|
| `POST /api/login` | público | devolve o token e os dados do usuário |
| `/api/municipes[/:id]` | servidor | CRUD de munícipes (`?busca=` por nome ou CPF) |
| `/api/familias[/:id]` | servidor | CRUD de famílias (`?busca=` por endereço ou responsável) |
| `/api/municipes/:id/atendimentos[/:id]` | servidor | CRUD dos atendimentos da própria unidade |
| `/api/municipes/:id/entregas[/:id]` | servidor | CRUD das entregas de benefícios |
| `GET /api/beneficios` | servidor | catálogo de benefícios |
| `/api/usuarios[/:id]` | gestor | CRUD de usuários (`?busca=` por nome ou e-mail) |
| `/api/unidades[/:id]` | gestor | CRUD de unidades (`?busca=` por nome) |

Todas as respostas são em JSON, inclusive os erros, no formato `{"mensagem": "..."}`.

## Problemas comuns que tivemos durante o desenvolvimento

- **"Access denied for user" ou erro 500 em todas as rotas:** confira o usuário e a senha do banco no `local.php`, e se o `banco.sql` foi executado.
- **O navegador acusa erro de CORS:** a API só aceita chamadas de `http://localhost:5173`. Se o Vite subir em outra porta, ajuste `cors.origem_permitida` em `Back-End/config/autoload/global.php`.
- **PHP 8.4:** o `composer install` recusa a versão. Rode `composer config platform.php 8.3.0` dentro de `Back-End` e repita o `composer install`.
- **Mudei algo em `config/` e não fez efeito:** rode `composer development-enable` (ou `composer clear-config-cache`).
