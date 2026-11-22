<?php

declare(strict_types=1);

namespace Gestao\Service;

use Comum\ErroDeNegocio;
use Comum\Validador;
use Gestao\Model\UnidadeTable;

class UnidadeService
{
    private const TIPOS = ['CRAS', 'CREAS', 'CAPS'];

    public function __construct(private UnidadeTable $unidades)
    {
    }

    public function listar(string $busca): array
    {
        return $this->unidades->listar(trim($busca));
    }

    public function consultar(int $id): array
    {
        $unidade = $this->unidades->buscarPorId($id);

        if ($unidade === null) {
            throw new ErroDeNegocio('Unidade não encontrada', 404);
        }

        return $unidade;
    }

    public function cadastrar(array $dados): int
    {
        return $this->unidades->inserir($this->validar($dados));
    }

    public function editar(int $id, array $dados): void
    {
        $this->consultar($id);
        $this->unidades->atualizar($id, $this->validar($dados));
    }

    public function excluir(int $id): void
    {
        $this->consultar($id);

        if ($this->unidades->possuiVinculos($id)) {
            throw new ErroDeNegocio(
                'Esta unidade possui usuários, atendimentos ou entregas registrados e não pode ser excluída',
                409
            );
        }

        $this->unidades->excluir($id);
    }

    private function validar(array $dados): array
    {
        if (!in_array($dados['tipo'] ?? null, self::TIPOS, true)) {
            throw new ErroDeNegocio('Selecione o tipo da unidade');
        }

        return [
            'nome' => Validador::textoObrigatorio($dados['nome'] ?? '', 100, 'Informe o nome da unidade (até 100 caracteres)'),
            'tipo' => $dados['tipo'],
        ];
    }
}
