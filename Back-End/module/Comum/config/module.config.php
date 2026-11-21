<?php

declare(strict_types=1);

namespace Comum;

return [
    'listeners' => [
        Listener\CorsListener::class,
        Listener\RespostaJsonListener::class,
    ],
];
