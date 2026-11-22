<?php

declare(strict_types=1);

namespace Gestao\Model;

use Laminas\Db\Sql\Select;
use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;

class UsuarioTable
{
    public function __construct(private TableGateway $tabela)
    {
    }

    public function listar(string $busca): array
    {
        $consulta = $this->consultaComUnidade()->order('usuarios.nome');

        if ($busca !== '') {
            $consulta->where->like('usuarios.nome', "%{$busca}%")->or->like('usuarios.email', "%{$busca}%");
        }

        $usuarios = [];

        foreach ($this->tabela->selectWith($consulta) as $linha) {
            $usuarios[] = $this->paraResposta($linha->getArrayCopy());
        }

        return $usuarios;
    }

    public function buscarPorId(int $id): ?array
    {
        $consulta = $this->consultaComUnidade()->where(['usuarios.id' => $id]);
        $linha = $this->tabela->selectWith($consulta)->current();

        return $linha ? $this->paraResposta($linha->getArrayCopy()) : null;
    }

    public function emailEmUso(string $email, ?int $ignorarUsuarioId): bool
    {
        $consulta = $this->tabela->getSql()->select()->columns(['id'])->where(['email' => $email]);

        if ($ignorarUsuarioId !== null) {
            $consulta->where->notEqualTo('id', $ignorarUsuarioId);
        }

        return $this->tabela->selectWith($consulta)->count() > 0;
    }

    public function possuiRegistros(int $id): bool
    {
        $sql = new Sql($this->tabela->getAdapter());

        foreach (['atendimentos', 'entregas_beneficio'] as $tabelaDeRegistros) {
            $consulta = $sql->select($tabelaDeRegistros)->columns(['id'])->where(['usuario_id' => $id])->limit(1);

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

    private function consultaComUnidade(): Select
    {
        return $this->tabela->getSql()->select()
            ->columns(['id', 'nome', 'email', 'funcao', 'perfil', 'unidade_id'])
            ->join(
                'unidades',
                'unidades.id = usuarios.unidade_id',
                ['unidade_nome' => 'nome'],
                Select::JOIN_LEFT
            );
    }

    private function paraResposta(array $linha): array
    {
        return [
            'id' => (int) $linha['id'],
            'nome' => $linha['nome'],
            'email' => $linha['email'],
            'funcao' => $linha['funcao'],
            'perfil' => $linha['perfil'],
            'unidadeId' => $linha['unidade_id'] === null ? null : (int) $linha['unidade_id'],
            'unidadeNome' => $linha['unidade_nome'],
        ];
    }
}
