<?php

declare(strict_types=1);

namespace Municipe\Model;

use Laminas\Db\TableGateway\TableGateway;

class DadosSocioeconomicosTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function buscarPorMunicipe(int $municipeId): ?array
    {
        $linha = $this->tabela->select(['municipe_id' => $municipeId])->current();

        if (!$linha) {
            return null;
        }

        return [
            'rendaMensal' => (float) $linha['renda_mensal'],
            'escolaridade' => $linha['escolaridade'],
            'ocupacao' => $linha['ocupacao'],
            'tipoMoradia' => $linha['tipo_moradia'],
        ];
    }

    public function inserir(int $municipeId, array $dados): void
    {
        $this->tabela->insert(['municipe_id' => $municipeId] + $dados);
    }

    public function atualizar(int $municipeId, array $dados): void
    {
        $this->tabela->update($dados, ['municipe_id' => $municipeId]);
    }

    public function excluir(int $municipeId): void
    {
        $this->tabela->delete(['municipe_id' => $municipeId]);
    }
}
