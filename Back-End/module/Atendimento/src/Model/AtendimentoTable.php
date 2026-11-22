<?php

declare(strict_types=1);

namespace Atendimento\Model;

use Laminas\Db\TableGateway\TableGateway;

class AtendimentoTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function listarDoMunicipeNaUnidade(int $municipeId, int $unidadeId): array
    {
        $consulta = $this->tabela->getSql()->select()
            ->columns(['id', 'tipo', 'descricao', 'data_atendimento'])
            ->join('usuarios', 'usuarios.id = atendimentos.usuario_id', ['profissional' => 'nome'])
            ->where([
                'atendimentos.municipe_id' => $municipeId,
                'atendimentos.unidade_id' => $unidadeId,
            ])
            ->order('atendimentos.data_atendimento DESC');

        $atendimentos = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $atendimentos[] = [
                'id' => (int) $linha['id'],
                'tipo' => $linha['tipo'],
                'descricao' => $linha['descricao'],
                'dataAtendimento' => $linha['data_atendimento'],
                'profissional' => $linha['profissional'],
            ];
        }

        return $atendimentos;
    }

    public function existeNaUnidade(int $id, int $municipeId, int $unidadeId): bool
    {
        return $this->tabela->select([
            'id' => $id,
            'municipe_id' => $municipeId,
            'unidade_id' => $unidadeId,
        ])->count() > 0;
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
