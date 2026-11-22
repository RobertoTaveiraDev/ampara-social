<?php

declare(strict_types=1);

namespace Gestao\Controller;

use Gestao\Service\UsuarioService;
use Laminas\Mvc\Controller\AbstractRestfulController;

class UsuarioController extends AbstractRestfulController
{
    public function __construct(private UsuarioService $usuarios)
    {
    }

    public function getList(): array
    {
        return $this->usuarios->listar((string) $this->params()->fromQuery('busca', ''));
    }

    public function get(mixed $id): array
    {
        return $this->usuarios->consultar((int) $id);
    }

    public function create(mixed $dados): array
    {
        $id = $this->usuarios->cadastrar((array) $dados);
        $this->getResponse()->setStatusCode(201);

        return ['id' => $id];
    }

    public function update(mixed $id, mixed $dados): array
    {
        $this->usuarios->editar((int) $id, (array) $dados, $this->gestorLogado());

        return ['id' => (int) $id];
    }

    public function delete(mixed $id): array
    {
        $this->usuarios->excluir((int) $id, $this->gestorLogado());

        return ['mensagem' => 'Usuário excluído'];
    }

    private function gestorLogado(): array
    {
        return $this->getEvent()->getParam('usuario');
    }
}
