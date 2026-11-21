<?php

declare(strict_types=1);

namespace Comum\Listener;

use Laminas\EventManager\AbstractListenerAggregate;
use Laminas\EventManager\EventManagerInterface;
use Laminas\Http\Response;
use Laminas\Mvc\Application;
use Laminas\Mvc\MvcEvent;
use Laminas\Stdlib\DispatchableInterface;

class RespostaJsonListener extends AbstractListenerAggregate
{
    public function attach(EventManagerInterface $events, $priority = 1): void
    {
        $events->getSharedManager()->attach(
            DispatchableInterface::class,
            MvcEvent::EVENT_DISPATCH,
            [$this, 'converterParaJson'],
            -70
        );
        $this->listeners[] = $events->attach(MvcEvent::EVENT_DISPATCH_ERROR, [$this, 'responderErro'], 100);
    }

    public function converterParaJson(MvcEvent $evento): ?Response
    {
        $resultado = $evento->getResult();

        if (!is_array($resultado)) {
            return null;
        }

        if ($evento->getResponse()->getStatusCode() === 405) {
            $resultado = ['mensagem' => 'Método não permitido'];
        }

        return $this->escreverJson($evento, $resultado);
    }

    public function responderErro(MvcEvent $evento): Response
    {
        if ($evento->getError() === Application::ERROR_EXCEPTION) {
            $evento->getResponse()->setStatusCode(500);

            return $this->escreverJson($evento, ['mensagem' => 'Erro interno no servidor']);
        }

        $evento->getResponse()->setStatusCode(404);

        return $this->escreverJson($evento, ['mensagem' => 'Recurso não encontrado']);
    }

    private function escreverJson(MvcEvent $evento, array $conteudo): Response
    {
        $resposta = $evento->getResponse();
        $resposta->getHeaders()->addHeaderLine('Content-Type', 'application/json; charset=utf-8');
        $resposta->setContent(json_encode($conteudo, JSON_UNESCAPED_UNICODE));
        $evento->setResult($resposta);

        return $resposta;
    }
}
