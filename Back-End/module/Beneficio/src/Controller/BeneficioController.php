<?php

declare(strict_types=1);

namespace Beneficio\Controller;

use Beneficio\Model\BeneficioTable;
use Laminas\Mvc\Controller\AbstractRestfulController;

class BeneficioController extends AbstractRestfulController
{
    public function __construct(private BeneficioTable $beneficios)
    {
    }

    public function getList(): array
    {
        return $this->beneficios->listar();
    }
}
