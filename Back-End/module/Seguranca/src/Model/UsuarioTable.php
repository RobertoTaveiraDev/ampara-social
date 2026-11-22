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

    public function buscarPorEmail(string $email): ?Usuario
    {
        $resultado = $this->tabela->select(function (Select $consulta) use ($email): void {
            $consulta
                ->join(
                    'unidades',
                    'unidades.id = usuarios.unidade_id',
                    ['unidade_nome' => 'nome', 'unidade_tipo' => 'tipo'],
                    Select::JOIN_LEFT
                )
                ->where(['usuarios.email' => $email]);
        });

        $usuario = $resultado->current();

        return $usuario instanceof Usuario ? $usuario : null;
    }
}
