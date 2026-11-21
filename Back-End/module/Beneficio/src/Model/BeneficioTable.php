<?php

declare(strict_types=1);

namespace Beneficio\Model;

use Laminas\Db\TableGateway\TableGateway;

class BeneficioTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function listar(): array
    {
        $consulta = $this->tabela->getSql()->select()->order('nome');

        $beneficios = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $beneficios[] = [
                'id' => (int) $linha['id'],
                'nome' => $linha['nome'],
            ];
        }

        return $beneficios;
    }

    public function existe(int $id): bool
    {
        return $this->tabela->select(['id' => $id])->count() > 0;
    }
}
