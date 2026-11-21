<?php

declare(strict_types=1);

namespace Beneficio;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\Db\TableGateway\TableGateway;
use Municipe\Model\MunicipeTable;

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
                Model\BeneficioTable::class => fn ($container) => new Model\BeneficioTable(
                    new TableGateway('beneficios', $container->get(AdapterInterface::class))
                ),
                Model\EntregaTable::class => fn ($container) => new Model\EntregaTable(
                    new TableGateway('entregas_beneficio', $container->get(AdapterInterface::class))
                ),
                Service\EntregaService::class => fn ($container) => new Service\EntregaService(
                    $container->get(Model\EntregaTable::class),
                    $container->get(Model\BeneficioTable::class),
                    $container->get(MunicipeTable::class)
                ),
            ],
        ];
    }

    public function getControllerConfig(): array
    {
        return [
            'factories' => [
                Controller\BeneficioController::class => fn ($container) => new Controller\BeneficioController(
                    $container->get(Model\BeneficioTable::class)
                ),
                Controller\EntregaController::class => fn ($container) => new Controller\EntregaController(
                    $container->get(Service\EntregaService::class)
                ),
            ],
        ];
    }
}
