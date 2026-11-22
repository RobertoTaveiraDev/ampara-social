<?php

declare(strict_types=1);

namespace Seguranca\Service;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Seguranca\Model\Usuario;

class TokenService
{
    private const ALGORITMO = 'HS256';

    public function __construct(private string $chave, private int $validadeEmMinutos)
    {
    }

    public function gerar(Usuario $usuario): string
    {
        $agora = time();

        return JWT::encode([
            'id' => $usuario->id,
            'nome' => $usuario->nome,
            'unidadeId' => $usuario->unidadeId,
            'perfil' => $usuario->perfil,
            'iat' => $agora,
            'exp' => $agora + $this->validadeEmMinutos * 60,
        ], $this->chave, self::ALGORITMO);
    }

    public function decodificar(string $token): ?array
    {
        try {
            $conteudo = JWT::decode($token, new Key($this->chave, self::ALGORITMO));
        } catch (Exception) {
            return null;
        }

        return [
            'id' => $conteudo->id,
            'nome' => $conteudo->nome,
            'unidadeId' => $conteudo->unidadeId,
            'perfil' => $conteudo->perfil,
        ];
    }
}
