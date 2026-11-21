<?php

declare(strict_types=1);

namespace Seguranca;

use Laminas\Router\Http\Literal;

return [
    'router' => [
        'routes' => [
            'login' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/api/login',
                    'defaults' => [
                        'controller' => Controller\LoginController::class,
                        'publica' => true,
                    ],
                ],
            ],
            'usuario-logado' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/api/me',
                    'defaults' => [
                        'controller' => Controller\UsuarioLogadoController::class,
                        'cargos' => ['tecnico', 'coordenador', 'gestor', 'admin'],
                    ],
                ],
            ],
        ],
    ],
    'listeners' => [
        Listener\AutorizacaoListener::class,
    ],
];
