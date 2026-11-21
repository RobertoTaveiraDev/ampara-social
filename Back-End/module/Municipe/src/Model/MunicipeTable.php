<?php

declare(strict_types=1);

namespace Municipe\Model;

use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;

class MunicipeTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function buscarPorNomeOuCpf(string $texto): array
    {
        $consulta = $this->tabela->getSql()->select()
            ->columns(['id', 'nome', 'cpf', 'data_nascimento'])
            ->order('nome');

        if ($texto !== '') {
            $digitos = preg_replace('/\D/', '', $texto);
            $consulta->where->like('nome', "%{$texto}%");

            if ($digitos !== '') {
                $consulta->where->or->like('cpf', "{$digitos}%");
            }
        }

        $municipes = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $municipes[] = [
                'id' => (int) $linha['id'],
                'nome' => $linha['nome'],
                'cpf' => $linha['cpf'],
                'dataNascimento' => $linha['data_nascimento'],
            ];
        }

        return $municipes;
    }

    public function buscarPorId(int $id): ?array
    {
        $consulta = $this->tabela->getSql()->select()
            ->join(
                'familias',
                'familias.id = municipes.familia_id',
                ['familia_endereco' => 'endereco', 'familia_bairro' => 'bairro']
            )
            ->where(['municipes.id' => $id]);

        $linha = $this->tabela->selectWith($consulta)->current();

        if (!$linha) {
            return null;
        }

        return [
            'id' => (int) $linha['id'],
            'nome' => $linha['nome'],
            'cpf' => $linha['cpf'],
            'nis' => $linha['nis'],
            'dataNascimento' => $linha['data_nascimento'],
            'sexo' => $linha['sexo'],
            'parentesco' => $linha['parentesco'],
            'telefone' => $linha['telefone'],
            'familia' => [
                'id' => (int) $linha['familia_id'],
                'endereco' => $linha['familia_endereco'],
                'bairro' => $linha['familia_bairro'],
            ],
        ];
    }

    public function existe(int $id): bool
    {
        return $this->tabela->select(['id' => $id])->count() > 0;
    }

    public function possuiAtendimentosOuEntregas(int $id): bool
    {
        $sql = new Sql($this->tabela->getAdapter());

        foreach (['atendimentos', 'entregas_beneficio'] as $tabelaDoHistorico) {
            $consulta = $sql->select($tabelaDoHistorico)->columns(['id'])->where(['municipe_id' => $id])->limit(1);

            if ($sql->prepareStatementForSqlObject($consulta)->execute()->count() > 0) {
                return true;
            }
        }

        return false;
    }

    public function cpfEmUso(string $cpf, ?int $ignorarMunicipeId): bool
    {
        return $this->valorEmUso('cpf', $cpf, $ignorarMunicipeId);
    }

    public function nisEmUso(string $nis, ?int $ignorarMunicipeId): bool
    {
        return $this->valorEmUso('nis', $nis, $ignorarMunicipeId);
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

    private function valorEmUso(string $coluna, string $valor, ?int $ignorarMunicipeId): bool
    {
        $consulta = $this->tabela->getSql()->select()->columns(['id'])->where([$coluna => $valor]);

        if ($ignorarMunicipeId !== null) {
            $consulta->where->notEqualTo('id', $ignorarMunicipeId);
        }

        return $this->tabela->selectWith($consulta)->count() > 0;
    }
}
