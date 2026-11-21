<?php

declare(strict_types=1);

namespace Atendimento;

use Laminas\Router\Http\Segment;

return [
    'router' => [
        'routes' => [
            'atendimentos' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/api/municipes/:municipeId/atendimentos[/:id]',
                    'constraints' => [
                        'municipeId' => '[0-9]+',
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\AtendimentoController::class,
                    ],
                ],
            ],
        ],
    ],
];
