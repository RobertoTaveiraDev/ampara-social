<?php

declare(strict_types=1);

namespace Seguranca\Service;

use Seguranca\Model\UsuarioTable;

class LoginService
{
    public function __construct(private UsuarioTable $usuarios, private TokenService $tokens)
    {
    }

    public function entrar(string $email, string $senha): ?array
    {
        $usuario = $this->usuarios->buscarAtivoPorEmail($email);

        if ($usuario === null || !password_verify($senha, $usuario->senhaHash)) {
            return null;
        }

        return [
            'token' => $this->tokens->gerar($usuario),
            'usuario' => $usuario->paraResposta(),
        ];
    }
}
