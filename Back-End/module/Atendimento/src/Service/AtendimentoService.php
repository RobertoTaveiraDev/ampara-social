<?php

declare(strict_types=1);

namespace Atendimento\Service;

use Atendimento\Model\AtendimentoTable;
use Comum\ErroDeNegocio;
use Comum\Validador;
use Municipe\Model\MunicipeTable;

class AtendimentoService
{
    private const TIPOS = [
        'Acolhimento',
        'Atendimento individual',
        'Acompanhamento familiar',
        'Visita domiciliar',
        'Escuta especializada',
    ];

    public function __construct(private AtendimentoTable $atendimentos, private MunicipeTable $municipes)
    {
    }

    public function listar(int $municipeId, array $usuario): array
    {
        $this->exigirMunicipe($municipeId);

        return $this->atendimentos->listarDoMunicipeNaUnidade($municipeId, $usuario['unidadeId']);
    }

    public function registrar(int $municipeId, array $dados, array $usuario): int
    {
        $this->exigirMunicipe($municipeId);

        return $this->atendimentos->inserir([
            'municipe_id' => $municipeId,
            'unidade_id' => $usuario['unidadeId'],
            'usuario_id' => $usuario['id'],
        ] + $this->validar($dados));
    }

    public function editar(int $municipeId, int $id, array $dados, array $usuario): void
    {
        $this->exigirAtendimentoDaUnidade($municipeId, $id, $usuario);
        $this->atendimentos->atualizar($id, $this->validar($dados));
    }

    public function excluir(int $municipeId, int $id, array $usuario): void
    {
        $this->exigirAtendimentoDaUnidade($municipeId, $id, $usuario);
        $this->atendimentos->excluir($id);
    }

    private function validar(array $dados): array
    {
        if (!in_array($dados['tipo'] ?? null, self::TIPOS, true)) {
            throw new ErroDeNegocio('Selecione o tipo de atendimento');
        }

        return [
            'tipo' => $dados['tipo'],
            'descricao' => Validador::textoObrigatorio(
                $dados['descricao'] ?? '',
                5000,
                'Descreva o atendimento (até 5000 caracteres)'
            ),
        ];
    }

    private function exigirAtendimentoDaUnidade(int $municipeId, int $id, array $usuario): void
    {
        if (!$this->atendimentos->existeNaUnidade($id, $municipeId, $usuario['unidadeId'])) {
            throw new ErroDeNegocio('Atendimento não encontrado', 404);
        }
    }

    private function exigirMunicipe(int $municipeId): void
    {
        if (!$this->municipes->existe($municipeId)) {
            throw new ErroDeNegocio('Munícipe não encontrado', 404);
        }
    }
}
