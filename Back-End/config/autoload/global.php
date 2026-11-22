<?php

/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return [
    'db' => [
        'driver' => 'Pdo_Mysql',
        'hostname' => 'localhost',
        'database' => 'ampara_social',
        'charset' => 'utf8mb4',
    ],
    'cors' => [
        'origem_permitida' => 'http://localhost:5173',
    ],
    'jwt' => [
        'validade_em_minutos' => 60,
    ],
];
