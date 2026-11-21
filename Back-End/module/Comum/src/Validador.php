<?php

declare(strict_types=1);

namespace Comum;

class Validador
{
    public static function textoObrigatorio(mixed $valor, int $tamanhoMaximo, string $mensagem): string
    {
        $texto = trim((string) $valor);

        if ($texto === '' || mb_strlen($texto) > $tamanhoMaximo) {
            throw new ErroDeNegocio($mensagem);
        }

        return $texto;
    }

    public static function telefoneOpcional(mixed $valor): ?string
    {
        $telefone = trim((string) $valor);

        if ($telefone === '') {
            return null;
        }

        $quantidadeDeDigitos = strlen(preg_replace('/\D/', '', $telefone));

        if ($quantidadeDeDigitos < 10 || $quantidadeDeDigitos > 11 || strlen($telefone) > 20) {
            throw new ErroDeNegocio('Informe o telefone com DDD, com 10 ou 11 dígitos');
        }

        return $telefone;
    }
}
