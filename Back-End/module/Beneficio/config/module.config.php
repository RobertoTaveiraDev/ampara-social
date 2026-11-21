<?php

declare(strict_types=1);

namespace Beneficio;

use Laminas\Router\Http\Literal;
use Laminas\Router\Http\Segment;

return [
    'router' => [
        'routes' => [
            'beneficios' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/api/beneficios',
                    'defaults' => [
                        'controller' => Controller\BeneficioController::class,
                    ],
                ],
            ],
            'entregas' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/api/municipes/:municipeId/entregas[/:id]',
                    'constraints' => [
                        'municipeId' => '[0-9]+',
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\EntregaController::class,
                    ],
                ],
            ],
        ],
    ],
];
