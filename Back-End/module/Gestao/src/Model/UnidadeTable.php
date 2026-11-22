<?php

declare(strict_types=1);

namespace Gestao\Model;

use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;

class UnidadeTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function listar(string $busca): array
    {
        $consulta = $this->tabela->getSql()->select()->order('nome');

        if ($busca !== '') {
            $consulta->where->like('nome', "%{$busca}%");
        }

        $unidades = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $unidades[] = $this->paraResposta($linha->getArrayCopy());
        }

        return $unidades;
    }

    public function buscarPorId(int $id): ?array
    {
        $linha = $this->tabela->select(['id' => $id])->current();

        return $linha ? $this->paraResposta($linha->getArrayCopy()) : null;
    }

    public function existe(int $id): bool
    {
        return $this->tabela->select(['id' => $id])->count() > 0;
    }

    public function possuiVinculos(int $id): bool
    {
        $sql = new Sql($this->tabela->getAdapter());

        foreach (['usuarios', 'atendimentos', 'entregas_beneficio'] as $tabelaVinculada) {
            $consulta = $sql->select($tabelaVinculada)->columns(['id'])->where(['unidade_id' => $id])->limit(1);

            if ($sql->prepareStatementForSqlObject($consulta)->execute()->count() > 0) {
                return true;
            }
        }

        return false;
    }

    public function inserir(array $dados): int
    {
        $this->tabela->insert($dados);

        return (int) $this->tabela->getLastInsertValue();
    }

    public function atualizar(int $id, array $dados): void
    {
        $this->tabela->update($dados, ['id' => $id]);
    }

    public function excluir(int $id): void
    {
        $this->tabela->delete(['id' => $id]);
    }

    private function paraResposta(array $linha): array
    {
        return [
            'id' => (int) $linha['id'],
            'nome' => $linha['nome'],
            'tipo' => $linha['tipo'],
        ];
    }
}
