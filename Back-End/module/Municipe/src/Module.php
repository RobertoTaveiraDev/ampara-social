<?php

declare(strict_types=1);

namespace Municipe;

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
                Model\MunicipeTable::class => fn ($container) => new Model\MunicipeTable(
                    new TableGateway('municipes', $container->get(AdapterInterface::class))
                ),
                Model\FamiliaTable::class => fn ($container) => new Model\FamiliaTable(
                    new TableGateway('familias', $container->get(AdapterInterface::class))
                ),
                Model\DadosSocioeconomicosTable::class => fn ($container) => new Model\DadosSocioeconomicosTable(
                    new TableGateway('dados_socioeconomicos', $container->get(AdapterInterface::class))
                ),
                Service\MunicipeService::class => fn ($container) => new Service\MunicipeService(
                    $container->get(Model\MunicipeTable::class),
                    $container->get(Model\FamiliaTable::class),
                    $container->get(Model\DadosSocioeconomicosTable::class),
                    $container->get(AdapterInterface::class)
                ),
                Service\FamiliaService::class => fn ($container) => new Service\FamiliaService(
                    $container->get(Model\FamiliaTable::class)
                ),
            ],
        ];
    }

    public function getControllerConfig(): array
    {
        return [
            'factories' => [
                Controller\MunicipeController::class => fn ($container) => new Controller\MunicipeController(
                    $container->get(Service\MunicipeService::class)
                ),
                Controller\FamiliaController::class => fn ($container) => new Controller\FamiliaController(
                    $container->get(Service\FamiliaService::class)
                ),
            ],
        ];
    }
}
