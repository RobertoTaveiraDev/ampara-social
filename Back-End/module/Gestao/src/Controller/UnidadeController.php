<?php

declare(strict_types=1);

namespace Gestao\Controller;

use Gestao\Service\UnidadeService;
use Laminas\Mvc\Controller\AbstractRestfulController;

class UnidadeController extends AbstractRestfulController
{
    public function __construct(private UnidadeService $unidades)
    {
    }

    public function getList(): array
    {
        return $this->unidades->listar((string) $this->params()->fromQuery('busca', ''));
    }

    public function get(mixed $id): array
    {
        return $this->unidades->consultar((int) $id);
    }

    public function create(mixed $dados): array
    {
        $id = $this->unidades->cadastrar((array) $dados);
        $this->getResponse()->setStatusCode(201);

        return ['id' => $id];
    }

    public function update(mixed $id, mixed $dados): array
    {
        $this->unidades->editar((int) $id, (array) $dados);

        return ['id' => (int) $id];
    }

    public function delete(mixed $id): array
    {
        $this->unidades->excluir((int) $id);

        return ['mensagem' => 'Unidade excluída'];
    }
}
