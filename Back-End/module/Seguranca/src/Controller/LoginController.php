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

    public function create(mixed $dados): array
    {
        return $this->login->entrar((array) $dados);
    }
}
