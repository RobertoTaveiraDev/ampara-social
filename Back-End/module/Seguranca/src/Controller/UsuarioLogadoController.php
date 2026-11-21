<?php

declare(strict_types=1);

namespace Seguranca\Controller;

use Laminas\Mvc\Controller\AbstractRestfulController;
use Seguranca\Model\UsuarioTable;

class UsuarioLogadoController extends AbstractRestfulController
{
    public function __construct(private UsuarioTable $usuarios)
    {
    }

    public function getList()
    {
        $usuarioDoToken = $this->getEvent()->getParam('usuario');
        $usuario = $this->usuarios->buscarAtivoPorId($usuarioDoToken['id']);

        if ($usuario === null) {
            $this->getResponse()->setStatusCode(401);

            return ['mensagem' => 'Sessão expirada. Entre novamente'];
        }

        return $usuario->paraResposta();
    }
}
