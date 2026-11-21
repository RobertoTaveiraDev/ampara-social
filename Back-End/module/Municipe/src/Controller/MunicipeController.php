<?php

declare(strict_types=1);

namespace Municipe\Controller;

use Laminas\Mvc\Controller\AbstractRestfulController;
use Municipe\Service\MunicipeService;

class MunicipeController extends AbstractRestfulController
{
    public function __construct(private MunicipeService $municipes)
    {
    }

    public function getList()
    {
        return $this->municipes->buscar((string) $this->params()->fromQuery('busca', ''));
    }

    public function get($id)
    {
        return $this->municipes->consultar((int) $id);
    }

    public function create($dados)
    {
        $id = $this->municipes->cadastrar((array) $dados);
        $this->getResponse()->setStatusCode(201);

        return ['id' => $id];
    }

    public function update($id, $dados)
    {
        $this->municipes->editar((int) $id, (array) $dados);

        return ['id' => (int) $id];
    }

    public function delete($id)
    {
        $this->municipes->excluir((int) $id);

        return ['mensagem' => 'Munícipe excluído'];
    }
}
