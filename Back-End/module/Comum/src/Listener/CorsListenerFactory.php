<?php

declare(strict_types=1);

namespace Comum\Listener;

use Psr\Container\ContainerInterface;

class CorsListenerFactory
{
    public function __invoke(ContainerInterface $container): CorsListener
    {
        $configuracao = $container->get('config');

        return new CorsListener($configuracao['cors']['origem_permitida']);
    }
}
