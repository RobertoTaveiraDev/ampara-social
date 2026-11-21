<?php

declare(strict_types=1);

namespace Seguranca\Controller;

use Laminas\Mvc\Controller\AbstractRestfulController;
use Seguranca\Service\LoginService;

class LoginController extends AbstractRestfulController
{
    public function __construct(private LoginService $login)
    {
    }

    public function create($dados)
    {
        $email = trim((string) ($dados['email'] ?? ''));
        $senha = (string) ($dados['senha'] ?? '');

        if ($email === '' || $senha === '') {
            $this->getResponse()->setStatusCode(422);

            return ['mensagem' => 'Informe o e-mail e a senha'];
        }

        $resultado = $this->login->entrar($email, $senha);

        if ($resultado === null) {
            $this->getResponse()->setStatusCode(401);

            return ['mensagem' => 'E-mail ou senha inválidos'];
        }

        return $resultado;
    }
}
