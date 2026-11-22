<?php

declare(strict_types=1);

namespace Beneficio\Controller;

use Beneficio\Service\EntregaService;
use Laminas\Mvc\Controller\AbstractRestfulController;

class EntregaController extends AbstractRestfulController
{
    public function __construct(private EntregaService $entregas)
    {
    }

    public function getList(): array
    {
        return $this->entregas->listar($this->municipeId());
    }

    public function create(mixed $dados): array
    {
        $id = $this->entregas->registrar($this->municipeId(), (array) $dados, $this->usuarioLogado());
        $this->getResponse()->setStatusCode(201);

        return ['id' => $id];
    }

    public function update(mixed $id, mixed $dados): array
    {
        $this->entregas->editar($this->municipeId(), (int) $id, (array) $dados, $this->usuarioLogado());

        return ['id' => (int) $id];
    }

    public function delete(mixed $id): array
    {
        $this->entregas->excluir($this->municipeId(), (int) $id, $this->usuarioLogado());

        return ['mensagem' => 'Entrega excluída'];
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
