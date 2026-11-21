<?php

declare(strict_types=1);

namespace Seguranca;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\Db\ResultSet\ResultSet;
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
                Model\UsuarioTable::class => function ($container) {
                    $modeloDeLinha = new ResultSet();
                    $modeloDeLinha->setArrayObjectPrototype(new Model\Usuario());
                    $tabela = new TableGateway('usuarios', $container->get(AdapterInterface::class), null, $modeloDeLinha);

                    return new Model\UsuarioTable($tabela);
                },
                Service\TokenService::class => function ($container) {
                    $jwt = $container->get('config')['jwt'];

                    return new Service\TokenService($jwt['chave'], $jwt['validade_em_minutos']);
                },
                Service\LoginService::class => fn ($container) => new Service\LoginService(
                    $container->get(Model\UsuarioTable::class),
                    $container->get(Service\TokenService::class)
                ),
                Listener\AutorizacaoListener::class => fn ($container) => new Listener\AutorizacaoListener(
                    $container->get(Service\TokenService::class)
                ),
            ],
        ];
    }

    public function getControllerConfig(): array
    {
        return [
            'factories' => [
                Controller\LoginController::class => fn ($container) => new Controller\LoginController(
                    $container->get(Service\LoginService::class)
                ),
                Controller\UsuarioLogadoController::class => fn ($container) => new Controller\UsuarioLogadoController(
                    $container->get(Model\UsuarioTable::class)
                ),
            ],
        ];
    }
}
