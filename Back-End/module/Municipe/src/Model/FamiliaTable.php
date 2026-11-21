<?php

declare(strict_types=1);

namespace Municipe\Model;

use Laminas\Db\Sql\Expression;
use Laminas\Db\Sql\Select;
use Laminas\Db\TableGateway\TableGateway;

class FamiliaTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function listar(string $busca): array
    {
        $consulta = $this->tabela->getSql()->select()
            ->columns(['id', 'endereco', 'bairro', 'telefone'])
            ->join(
                'municipes',
                new Expression(
                    'municipes.familia_id = familias.id AND municipes.parentesco = ?',
                    ['Responsável familiar']
                ),
                ['responsavel' => 'nome'],
                Select::JOIN_LEFT
            )
            ->order('familias.id');

        if ($busca !== '') {
            $consulta->where->like('familias.endereco', "%{$busca}%")->or->like('municipes.nome', "%{$busca}%");
        }

        $familias = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $familias[] = [
                'id' => (int) $linha['id'],
                'endereco' => $linha['endereco'],
                'bairro' => $linha['bairro'],
                'telefone' => $linha['telefone'],
                'responsavel' => $linha['responsavel'],
            ];
        }

        return $familias;
    }

    public function buscarPorId(int $id): ?array
    {
        $linha = $this->tabela->select(['id' => $id])->current();

        if (!$linha) {
            return null;
        }

        return [
            'id' => (int) $linha['id'],
            'endereco' => $linha['endereco'],
            'bairro' => $linha['bairro'],
            'telefone' => $linha['telefone'],
        ];
    }

    public function existe(int $id): bool
    {
        return $this->tabela->select(['id' => $id])->count() > 0;
    }

    public function possuiMunicipes(int $id): bool
    {
        $consulta = $this->tabela->getSql()->select()
            ->columns([])
            ->join('municipes', 'municipes.familia_id = familias.id', ['id'])
            ->where(['familias.id' => $id])
            ->limit(1);

        return $this->tabela->selectWith($consulta)->count() > 0;
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
}
