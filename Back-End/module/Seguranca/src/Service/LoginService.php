<?php

declare(strict_types=1);

namespace Seguranca\Service;

use Comum\ErroDeNegocio;
use Seguranca\Model\UsuarioTable;

class LoginService
{
    public function __construct(private UsuarioTable $usuarios, private TokenService $tokens)
    {
    }

    public function entrar(array $dados): array
    {
        $email = trim((string) ($dados['email'] ?? ''));
        $senha = (string) ($dados['senha'] ?? '');

        if ($email === '' || $senha === '') {
            throw new ErroDeNegocio('Informe o e-mail e a senha');
        }

        $usuario = $this->usuarios->buscarPorEmail($email);

        if ($usuario === null || !password_verify($senha, $usuario->senhaHash)) {
            throw new ErroDeNegocio('E-mail ou senha inválidos', 401);
        }

        return [
            'token' => $this->tokens->gerar($usuario),
            'usuario' => $usuario->paraResposta(),
        ];
    }
}
