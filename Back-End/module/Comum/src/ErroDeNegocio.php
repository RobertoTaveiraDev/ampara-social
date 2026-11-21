<?php

declare(strict_types=1);

namespace Comum;

use RuntimeException;

class ErroDeNegocio extends RuntimeException
{
    public function __construct(string $mensagem, private int $status = 422)
    {
        parent::__construct($mensagem);
    }

    public function status(): int
    {
        return $this->status;
    }
}
