<?php

declare(strict_types=1);

namespace Comum;

use Laminas\Http\Response;

class RespostaJson
{
    public static function escrever(Response $resposta, int $status, array $conteudo): Response
    {
        $resposta->setStatusCode($status);
        $resposta->getHeaders()->addHeaderLine('Content-Type', 'application/json; charset=utf-8');
        $resposta->setContent(json_encode($conteudo, JSON_UNESCAPED_UNICODE));

        return $resposta;
    }
}
