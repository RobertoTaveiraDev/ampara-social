<?php

declare(strict_types=1);

namespace Beneficio\Service;

use Beneficio\Model\BeneficioTable;
use Beneficio\Model\EntregaTable;
use Comum\ErroDeNegocio;
use Municipe\Model\MunicipeTable;

class EntregaService
{
    public function __construct(
        private EntregaTable $entregas,
        private BeneficioTable $beneficios,
        private MunicipeTable $municipes
    ) {
    }

    public function listar(int $municipeId): array
    {
        $this->exigirMunicipe($municipeId);

        return $this->entregas->listarDoMunicipe($municipeId);
    }

    public function registrar(int $municipeId, array $dados, array $usuario): int
    {
        $this->exigirMunicipe($municipeId);

        return $this->entregas->inserir([
            'municipe_id' => $municipeId,
            'unidade_id' => $usuario['unidadeId'],
            'usuario_id' => $usuario['id'],
            'data_entrega' => date('Y-m-d'),
        ] + $this->validar($dados));
    }

    public function editar(int $municipeId, int $id, array $dados, array $usuario): void
    {
        $this->exigirEntregaDaUnidade($municipeId, $id, $usuario);
        $this->entregas->atualizar($id, $this->validar($dados));
    }

    public function excluir(int $municipeId, int $id, array $usuario): void
    {
        $this->exigirEntregaDaUnidade($municipeId, $id, $usuario);
        $this->entregas->excluir($id);
    }

    private function validar(array $dados): array
    {
        $beneficioId = (int) ($dados['beneficioId'] ?? 0);
        $quantidade = filter_var($dados['quantidade'] ?? null, FILTER_VALIDATE_INT);

        if (!$this->beneficios->existe($beneficioId)) {
            throw new ErroDeNegocio('Selecione o benefício');
        }

        if ($quantidade === false || $quantidade < 1 || $quantidade > 1000) {
            throw new ErroDeNegocio('Informe uma quantidade entre 1 e 1000');
        }

        return [
            'beneficio_id' => $beneficioId,
            'quantidade' => $quantidade,
        ];
    }

    private function exigirEntregaDaUnidade(int $municipeId, int $id, array $usuario): void
    {
        $unidadeQueRegistrou = $this->entregas->unidadeQueRegistrou($id, $municipeId);

        if ($unidadeQueRegistrou === null) {
            throw new ErroDeNegocio('Entrega não encontrada', 404);
        }

        if ($unidadeQueRegistrou !== $usuario['unidadeId']) {
            throw new ErroDeNegocio('Só a unidade que registrou a entrega pode alterá-la', 403);
        }
    }

    private function exigirMunicipe(int $municipeId): void
    {
        if (!$this->municipes->existe($municipeId)) {
            throw new ErroDeNegocio('Munícipe não encontrado', 404);
        }
    }
}
