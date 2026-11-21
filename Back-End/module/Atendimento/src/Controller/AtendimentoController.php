<?php

declare(strict_types=1);

namespace Atendimento\Controller;

use Atendimento\Service\AtendimentoService;
use Laminas\Mvc\Controller\AbstractRestfulController;

class AtendimentoController extends AbstractRestfulController
{
    public function __construct(private AtendimentoService $atendimentos)
    {
    }

    public function getList()
    {
        return $this->atendimentos->listar($this->municipeId(), $this->usuarioLogado());
    }

    public function create($dados)
    {
        $id = $this->atendimentos->registrar($this->municipeId(), (array) $dados, $this->usuarioLogado());
        $this->getResponse()->setStatusCode(201);

        return ['id' => $id];
    }

    public function update($id, $dados)
    {
        $this->atendimentos->editar($this->municipeId(), (int) $id, (array) $dados, $this->usuarioLogado());

        return ['id' => (int) $id];
    }

    public function delete($id)
    {
        $this->atendimentos->excluir($this->municipeId(), (int) $id, $this->usuarioLogado());

        return ['mensagem' => 'Atendimento excluído'];
    }

    private function municipeId(): int
    {
        return (int) $this->params()->fromRoute('municipeId');
    }

    private function usuarioLogado(): array
    {
        return $this->getEvent()->getParam('usuario');
    }
}
