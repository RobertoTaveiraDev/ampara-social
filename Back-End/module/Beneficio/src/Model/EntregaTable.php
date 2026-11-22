<?php

declare(strict_types=1);

namespace Beneficio\Model;

use Laminas\Db\TableGateway\TableGateway;

class EntregaTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function listarDoMunicipe(int $municipeId): array
    {
        $consulta = $this->tabela->getSql()->select()
            ->columns(['id', 'beneficio_id', 'unidade_id', 'quantidade', 'data_entrega'])
            ->join('beneficios', 'beneficios.id = entregas_beneficio.beneficio_id', ['beneficio' => 'nome'])
            ->join('unidades', 'unidades.id = entregas_beneficio.unidade_id', ['unidade' => 'nome'])
            ->join('usuarios', 'usuarios.id = entregas_beneficio.usuario_id', ['profissional' => 'nome'])
            ->where(['entregas_beneficio.municipe_id' => $municipeId])
            ->order(['entregas_beneficio.data_entrega DESC', 'entregas_beneficio.id DESC']);

        $entregas = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $entregas[] = [
                'id' => (int) $linha['id'],
                'beneficioId' => (int) $linha['beneficio_id'],
                'unidadeId' => (int) $linha['unidade_id'],
                'beneficio' => $linha['beneficio'],
                'quantidade' => (int) $linha['quantidade'],
                'dataEntrega' => $linha['data_entrega'],
                'unidade' => $linha['unidade'],
                'profissional' => $linha['profissional'],
            ];
        }

        return $entregas;
    }

    public function unidadeQueRegistrou(int $id, int $municipeId): ?int
    {
        $linha = $this->tabela->select(['id' => $id, 'municipe_id' => $municipeId])->current();

        return $linha ? (int) $linha['unidade_id'] : null;
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
