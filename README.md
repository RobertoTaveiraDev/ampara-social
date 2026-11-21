# AMPARA SOCIAL

Atendimento Municipal, Proteção e Acompanhamento da Rede de Assistência.

Sistema que integra as unidades da assistência social do município (CRAS, CREAS e CAPS) em um cadastro único do cidadão, com encaminhamentos entre unidades e sigilo profissional garantido no back-end.

Projeto B2 da disciplina Web Avançada (UniSALESIANO).

| Integrante | RA |
|---|---|
| Roberto Alves Taveira Neto | 221366 |
| Felipe Correia de Souza Prado | 221512 |

## Pastas

- `Back-End/`: API em PHP 8.4 com Laminas MVC e MySQL.
- `Front-End/`: interface em React com Vite.

## Requisitos

- PHP 8.4 e Composer
- MySQL e HeidiSQL (ou outro cliente MySQL)
- Node.js e npm

## Como rodar

### 1. Banco de dados

Abra o arquivo `Back-End/database/banco.sql` no HeidiSQL e execute. Ele cria o banco `ampara_social` com as tabelas e os dados de exemplo.

### 2. Back-End

```bash
cd Back-End
cp config/autoload/local.php.dist config/autoload/local.php
composer install
composer development-enable
composer serve
```

Preencha no `local.php` a senha do MySQL e a chave do JWT. O `development-enable` só precisa ser rodado uma vez: ele desliga o cache de configuração do Laminas durante o desenvolvimento. A API fica em `http://localhost:8080/api`.

### 3. Front-End

```bash
cd Front-End
cp .env.exemplo .env
npm install
npm run dev
```

Abra o endereço que o Vite mostrar no terminal.
