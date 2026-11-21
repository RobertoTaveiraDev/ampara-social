<?php

declare(strict_types=1);

namespace Seguranca\Model;

class Usuario
{
    public int $id;
    public ?int $unidadeId;
    public ?string $unidadeNome;
    public ?string $unidadeTipo;
    public string $nome;
    public string $email;
    public string $senhaHash;
    public string $cargo;
    public string $funcao;

    public function exchangeArray(array $dados): void
    {
        $this->id = (int) $dados['id'];
        $this->unidadeId = $dados['unidade_id'] === null ? null : (int) $dados['unidade_id'];
        $this->unidadeNome = $dados['unidade_nome'];
        $this->unidadeTipo = $dados['unidade_tipo'];
        $this->nome = $dados['nome'];
        $this->email = $dados['email'];
        $this->senhaHash = $dados['senha_hash'];
        $this->cargo = $dados['cargo'];
        $this->funcao = $dados['funcao'];
    }

    public function paraResposta(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'cargo' => $this->cargo,
            'funcao' => $this->funcao,
            'unidadeId' => $this->unidadeId,
            'unidadeNome' => $this->unidadeNome,
            'unidadeTipo' => $this->unidadeTipo,
        ];
    }
}
