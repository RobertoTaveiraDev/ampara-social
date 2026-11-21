<?php

declare(strict_types=1);

namespace Comum\Listener;

use Comum\ErroDeNegocio;
use Comum\RespostaJson;
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

        $status = $evento->getResponse()->getStatusCode();

        if ($status === 405) {
            $resultado = ['mensagem' => 'Método não permitido'];
        }

        return $this->responder($evento, $status, $resultado);
    }

    public function responderErro(MvcEvent $evento): Response
    {
        $excecao = $evento->getParam('exception');

        if ($excecao instanceof ErroDeNegocio) {
            return $this->responder($evento, $excecao->status(), ['mensagem' => $excecao->getMessage()]);
        }

        if ($evento->getError() === Application::ERROR_EXCEPTION) {
            return $this->responder($evento, 500, ['mensagem' => 'Erro interno no servidor']);
        }

        return $this->responder($evento, 404, ['mensagem' => 'Recurso não encontrado']);
    }

    private function responder(MvcEvent $evento, int $status, array $conteudo): Response
    {
        $resposta = RespostaJson::escrever($evento->getResponse(), $status, $conteudo);
        $evento->setResult($resposta);

        return $resposta;
    }
}
