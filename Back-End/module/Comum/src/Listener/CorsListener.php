<?php

declare(strict_types=1);

namespace Comum\Listener;

use Laminas\EventManager\AbstractListenerAggregate;
use Laminas\EventManager\EventManagerInterface;
use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\MvcEvent;

class CorsListener extends AbstractListenerAggregate
{
    public function __construct(private string $origemPermitida)
    {
    }

    public function attach(EventManagerInterface $events, $priority = 1): void
    {
        $this->listeners[] = $events->attach(MvcEvent::EVENT_ROUTE, [$this, 'responderPreflight'], 100);
        $this->listeners[] = $events->attach(MvcEvent::EVENT_FINISH, [$this, 'adicionarCabecalhos'], 100);
    }

    public function responderPreflight(MvcEvent $evento): ?Response
    {
        $requisicao = $evento->getRequest();

        if (!$requisicao instanceof Request || !$requisicao->isOptions()) {
            return null;
        }

        $resposta = $evento->getResponse();
        $resposta->setStatusCode(204);

        return $resposta;
    }

    public function adicionarCabecalhos(MvcEvent $evento): void
    {
        $resposta = $evento->getResponse();

        if (!$resposta instanceof Response) {
            return;
        }

        $resposta->getHeaders()->addHeaders([
            'Access-Control-Allow-Origin' => $this->origemPermitida,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Authorization, Content-Type',
        ]);
    }
}
