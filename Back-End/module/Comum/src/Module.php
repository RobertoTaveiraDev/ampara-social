<?php

declare(strict_types=1);

namespace Comum;

class Module
{
    public function getConfig(): array
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function getServiceConfig(): array
    {
        return [
            'factories' => [
                Listener\CorsListener::class => fn ($container) => new Listener\CorsListener(
                    $container->get('config')['cors']['origem_permitida']
                ),
                Listener\RespostaJsonListener::class => fn () => new Listener\RespostaJsonListener(),
            ],
        ];
    }
}
