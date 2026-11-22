<?php

declare(strict_types=1);

namespace Municipe;

use Laminas\Router\Http\Segment;

return [
    'router' => [
        'routes' => [
            'municipes' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/api/municipes[/:id]',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\MunicipeController::class,
                        'perfil' => 'servidor',
                    ],
                ],
            ],
            'familias' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/api/familias[/:id]',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\FamiliaController::class,
                        'perfil' => 'servidor',
                    ],
                ],
            ],
        ],
    ],
];
