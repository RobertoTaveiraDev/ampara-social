<?php

declare(strict_types=1);

namespace Seguranca\Model;

use Laminas\Db\Sql\Select;
use Laminas\Db\TableGateway\TableGateway;

class UsuarioTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function buscarAtivoPorEmail(string $email): ?Usuario
    {
        return $this->buscarAtivo(['usuarios.email' => $email]);
    }

    public function buscarAtivoPorId(int $id): ?Usuario
    {
        return $this->buscarAtivo(['usuarios.id' => $id]);
    }

    private function buscarAtivo(array $condicoes): ?Usuario
    {
        $resultado = $this->tabela->select(function (Select $consulta) use ($condicoes): void {
            $consulta
                ->join(
                    'unidades',
                    'unidades.id = usuarios.unidade_id',
                    ['unidade_nome' => 'nome', 'unidade_tipo' => 'tipo'],
                    Select::JOIN_LEFT
                )
                ->where($condicoes)
                ->where(['usuarios.ativo' => 1]);
        });

        $usuario = $resultado->current();

        return $usuario instanceof Usuario ? $usuario : null;
    }
}
