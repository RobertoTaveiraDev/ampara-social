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
        ],
    ],
    'listeners' => [
        Listener\AutorizacaoListener::class,
    ],
];
