<?php

declare(strict_types=1);

namespace Municipe\Controller;

use Laminas\Mvc\Controller\AbstractRestfulController;
use Municipe\Service\FamiliaService;

class FamiliaController extends AbstractRestfulController
{
    public function __construct(private FamiliaService $familias)
    {
    }

    public function getList(): array
    {
        return $this->familias->listar((string) $this->params()->fromQuery('busca', ''));
    }

    public function get(mixed $id): array
    {
        return $this->familias->consultar((int) $id);
    }

    public function create(mixed $dados): array
    {
        $id = $this->familias->cadastrar((array) $dados);
        $this->getResponse()->setStatusCode(201);

        return ['id' => $id];
    }

    public function update(mixed $id, mixed $dados): array
    {
        $this->familias->editar((int) $id, (array) $dados);

        return ['id' => (int) $id];
    }

    public function delete(mixed $id): array
    {
        $this->familias->excluir((int) $id);

        return ['mensagem' => 'Família excluída'];
    }
}
