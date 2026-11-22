<?php

declare(strict_types=1);

namespace Seguranca\Listener;

use Comum\RespostaJson;
use Laminas\EventManager\AbstractListenerAggregate;
use Laminas\EventManager\EventManagerInterface;
use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\MvcEvent;
use Seguranca\Service\TokenService;

class AutorizacaoListener extends AbstractListenerAggregate
{
    public function __construct(private TokenService $tokens)
    {
    }

    public function attach(EventManagerInterface $events, $priority = 1): void
    {
        $this->listeners[] = $events->attach(MvcEvent::EVENT_ROUTE, [$this, 'conferirAcesso'], -100);
    }

    public function conferirAcesso(MvcEvent $evento): ?Response
    {
        $rota = $evento->getRouteMatch();

        if ($rota === null || $rota->getParam('publica', false)) {
            return null;
        }

        $usuario = $this->usuarioDoToken($evento->getRequest());

        if ($usuario === null) {
            return RespostaJson::escrever($evento->getResponse(), 401, [
                'mensagem' => 'Sessão expirada. Entre novamente',
            ]);
        }

        if ($rota->getParam('perfil') !== $usuario['perfil']) {
            return RespostaJson::escrever($evento->getResponse(), 403, [
                'mensagem' => 'Acesso não permitido para o seu perfil',
            ]);
        }

        $evento->setParam('usuario', $usuario);

        return null;
    }

    private function usuarioDoToken(Request $requisicao): ?array
    {
        $cabecalho = $requisicao->getHeader('Authorization');

        if ($cabecalho === false || !preg_match('/^Bearer\s+(\S+)$/', $cabecalho->getFieldValue(), $partes)) {
            return null;
        }

        return $this->tokens->decodificar($partes[1]);
    }
}
