<?php

declare(strict_types=1);

namespace Municipe\Service;

use Comum\ErroDeNegocio;
use Comum\Validador;
use Municipe\Model\FamiliaTable;

class FamiliaService
{
    public function __construct(private FamiliaTable $familias)
    {
    }

    public function listar(string $busca): array
    {
        return $this->familias->listar(trim($busca));
    }

    public function consultar(int $id): array
    {
        $familia = $this->familias->buscarPorId($id);

        if ($familia === null) {
            throw new ErroDeNegocio('Família não encontrada', 404);
        }

        return $familia;
    }

    public function cadastrar(array $dados): int
    {
        return $this->familias->inserir($this->validar($dados));
    }

    public function editar(int $id, array $dados): void
    {
        $this->consultar($id);
        $this->familias->atualizar($id, $this->validar($dados));
    }

    public function excluir(int $id): void
    {
        $this->consultar($id);

        if ($this->familias->possuiMunicipes($id)) {
            throw new ErroDeNegocio('Esta família possui munícipes vinculados e não pode ser excluída', 409);
        }

        $this->familias->excluir($id);
    }

    private function validar(array $dados): array
    {
        return [
            'endereco' => Validador::textoObrigatorio($dados['endereco'] ?? '', 150, 'Informe o endereço (até 150 caracteres)'),
            'bairro' => Validador::textoObrigatorio($dados['bairro'] ?? '', 80, 'Informe o bairro (até 80 caracteres)'),
            'telefone' => Validador::telefoneOpcional($dados['telefone'] ?? ''),
        ];
    }
}
