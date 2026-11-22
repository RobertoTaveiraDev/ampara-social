<?php

declare(strict_types=1);

namespace Gestao;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\Db\TableGateway\TableGateway;

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
                Model\UnidadeTable::class => fn ($container) => new Model\UnidadeTable(
                    new TableGateway('unidades', $container->get(AdapterInterface::class))
                ),
                Model\UsuarioTable::class => fn ($container) => new Model\UsuarioTable(
                    new TableGateway('usuarios', $container->get(AdapterInterface::class))
                ),
                Service\UnidadeService::class => fn ($container) => new Service\UnidadeService(
                    $container->get(Model\UnidadeTable::class)
                ),
                Service\UsuarioService::class => fn ($container) => new Service\UsuarioService(
                    $container->get(Model\UsuarioTable::class),
                    $container->get(Model\UnidadeTable::class)
                ),
            ],
        ];
    }

    public function getControllerConfig(): array
    {
        return [
            'factories' => [
                Controller\UnidadeController::class => fn ($container) => new Controller\UnidadeController(
                    $container->get(Service\UnidadeService::class)
                ),
                Controller\UsuarioController::class => fn ($container) => new Controller\UsuarioController(
                    $container->get(Service\UsuarioService::class)
                ),
            ],
        ];
    }
}
