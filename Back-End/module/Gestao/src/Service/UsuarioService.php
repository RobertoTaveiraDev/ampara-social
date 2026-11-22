<?php

declare(strict_types=1);

namespace Gestao\Service;

use Comum\ErroDeNegocio;
use Comum\Validador;
use Gestao\Model\UnidadeTable;
use Gestao\Model\UsuarioTable;

class UsuarioService
{
    private const PERFIS = ['servidor', 'gestor'];
    private const TAMANHO_MINIMO_DA_SENHA = 6;

    public function __construct(private UsuarioTable $usuarios, private UnidadeTable $unidades)
    {
    }

    public function listar(string $busca): array
    {
        return $this->usuarios->listar(trim($busca));
    }

    public function consultar(int $id): array
    {
        $usuario = $this->usuarios->buscarPorId($id);

        if ($usuario === null) {
            throw new ErroDeNegocio('Usuário não encontrado', 404);
        }

        return $usuario;
    }

    public function cadastrar(array $dados): int
    {
        $usuario = $this->validar($dados, null);
        $usuario['senha_hash'] = $this->hashDaSenha($dados['senha'] ?? '');

        return $this->usuarios->inserir($usuario);
    }

    public function editar(int $id, array $dados, array $gestorLogado): void
    {
        $this->consultar($id);
        $usuario = $this->validar($dados, $id);

        if ($id === $gestorLogado['id'] && $usuario['perfil'] !== 'gestor') {
            throw new ErroDeNegocio('Você não pode remover o seu próprio perfil de gestor');
        }

        if (($dados['senha'] ?? '') !== '') {
            $usuario['senha_hash'] = $this->hashDaSenha($dados['senha']);
        }

        $this->usuarios->atualizar($id, $usuario);
    }

    public function excluir(int $id, array $gestorLogado): void
    {
        $this->consultar($id);

        if ($id === $gestorLogado['id']) {
            throw new ErroDeNegocio('Você não pode excluir o próprio usuário');
        }

        if ($this->usuarios->possuiRegistros($id)) {
            throw new ErroDeNegocio(
                'Este usuário possui atendimentos ou entregas registrados e não pode ser excluído',
                409
            );
        }

        $this->usuarios->excluir($id);
    }

    private function validar(array $dados, ?int $usuarioId): array
    {
        $nome = Validador::textoObrigatorio($dados['nome'] ?? '', 100, 'Informe o nome (até 100 caracteres)');
        $email = Validador::textoObrigatorio($dados['email'] ?? '', 150, 'Informe o e-mail (até 150 caracteres)');
        $funcao = Validador::textoObrigatorio($dados['funcao'] ?? '', 60, 'Informe a função (até 60 caracteres)');
        $perfil = $dados['perfil'] ?? null;
        $unidadeId = null;

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new ErroDeNegocio('Informe um e-mail válido');
        }

        if (!in_array($perfil, self::PERFIS, true)) {
            throw new ErroDeNegocio('Selecione o perfil');
        }

        if ($perfil === 'servidor') {
            $unidadeId = (int) ($dados['unidadeId'] ?? 0);

            if (!$this->unidades->existe($unidadeId)) {
                throw new ErroDeNegocio('Selecione a unidade do servidor');
            }
        }

        if ($this->usuarios->emailEmUso($email, $usuarioId)) {
            throw new ErroDeNegocio('Este e-mail já está em uso', 409);
        }

        return [
            'nome' => $nome,
            'email' => $email,
            'funcao' => $funcao,
            'perfil' => $perfil,
            'unidade_id' => $unidadeId,
        ];
    }

    private function hashDaSenha(mixed $senha): string
    {
        $senha = (string) $senha;

        if (mb_strlen($senha) < self::TAMANHO_MINIMO_DA_SENHA) {
            throw new ErroDeNegocio('A senha deve ter pelo menos ' . self::TAMANHO_MINIMO_DA_SENHA . ' caracteres');
        }

        return password_hash($senha, PASSWORD_DEFAULT);
    }
}
