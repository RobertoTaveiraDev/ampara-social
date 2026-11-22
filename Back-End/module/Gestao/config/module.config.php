<?php

declare(strict_types=1);

namespace Gestao;

use Laminas\Router\Http\Segment;

return [
    'router' => [
        'routes' => [
            'unidades' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/api/unidades[/:id]',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\UnidadeController::class,
                        'perfil' => 'gestor',
                    ],
                ],
            ],
            'usuarios' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/api/usuarios[/:id]',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\UsuarioController::class,
                        'perfil' => 'gestor',
                    ],
                ],
            ],
        ],
    ],
];
