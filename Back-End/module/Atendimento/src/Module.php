<?php

declare(strict_types=1);

namespace Atendimento;

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
                Model\AtendimentoTable::class => fn ($container) => new Model\AtendimentoTable(
                    new TableGateway('atendimentos', $container->get(AdapterInterface::class))
                ),
                Service\AtendimentoService::class => fn ($container) => new Service\AtendimentoService(
                    $container->get(Model\AtendimentoTable::class),
                    $container->get(MunicipeTable::class)
                ),
            ],
        ];
    }

    public function getControllerConfig(): array
    {
        return [
            'factories' => [
                Controller\AtendimentoController::class => fn ($container) => new Controller\AtendimentoController(
                    $container->get(Service\AtendimentoService::class)
                ),
            ],
        ];
    }
}
