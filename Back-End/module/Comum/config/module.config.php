<?php

declare(strict_types=1);

namespace Comum;

use Laminas\ServiceManager\Factory\InvokableFactory;

return [
    'service_manager' => [
        'factories' => [
            Listener\CorsListener::class => Listener\CorsListenerFactory::class,
            Listener\RespostaJsonListener::class => InvokableFactory::class,
        ],
    ],
    'listeners' => [
        Listener\CorsListener::class,
        Listener\RespostaJsonListener::class,
    ],
];
