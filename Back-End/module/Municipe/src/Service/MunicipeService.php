<?php

declare(strict_types=1);

namespace Municipe\Service;

use Comum\ErroDeNegocio;
use Comum\Validador;
use DateTimeImmutable;
use Laminas\Db\Adapter\AdapterInterface;
use Municipe\Model\DadosSocioeconomicosTable;
use Municipe\Model\FamiliaTable;
use Municipe\Model\MunicipeTable;
use Throwable;

class MunicipeService
{
    private const SEXOS = ['Feminino', 'Masculino', 'Outro', 'Prefere não informar'];
    private const PARENTESCOS = ['Responsável familiar', 'Cônjuge', 'Filho(a)', 'Outro'];
    private const ESCOLARIDADES = [
        'Não alfabetizado',
        'Ensino fundamental incompleto',
        'Ensino fundamental completo',
        'Ensino médio completo',
        'Ensino superior',
    ];
    private const TIPOS_DE_MORADIA = ['Própria', 'Alugada', 'Cedida', 'Ocupação'];

    public function __construct(
        private MunicipeTable $municipes,
        private FamiliaTable $familias,
        private DadosSocioeconomicosTable $dadosSocioeconomicos,
        private AdapterInterface $banco
    ) {
    }

    public function buscar(string $texto): array
    {
        $texto = trim($texto);

        return $this->municipes->buscarPorNomeOuCpf($texto, $this->somenteDigitos($texto));
    }

    public function consultar(int $id): array
    {
        $municipe = $this->municipes->buscarPorId($id);

        if ($municipe === null) {
            throw new ErroDeNegocio('Munícipe não encontrado', 404);
        }

        $municipe['socioeconomico'] = $this->dadosSocioeconomicos->buscarPorMunicipe($id);

        return $municipe;
    }

    public function cadastrar(array $dados): int
    {
        $cadastro = $this->validar($dados, null);

        return $this->emTransacao(function () use ($cadastro): int {
            $municipeId = $this->municipes->inserir($cadastro['municipe']);
            $this->dadosSocioeconomicos->inserir($municipeId, $cadastro['socioeconomico']);

            return $municipeId;
        });
    }

    public function editar(int $id, array $dados): void
    {
        $this->exigirMunicipe($id);
        $cadastro = $this->validar($dados, $id);

        $this->emTransacao(function () use ($id, $cadastro): void {
            $this->municipes->atualizar($id, $cadastro['municipe']);
            $this->dadosSocioeconomicos->atualizar($id, $cadastro['socioeconomico']);
        });
    }

    public function excluir(int $id): void
    {
        $this->exigirMunicipe($id);

        if ($this->municipes->possuiAtendimentosOuEntregas($id)) {
            throw new ErroDeNegocio(
                'Este munícipe possui atendimentos ou entregas de benefícios registrados e não pode ser excluído',
                409
            );
        }

        $this->emTransacao(function () use ($id): void {
            $this->dadosSocioeconomicos->excluir($id);
            $this->municipes->excluir($id);
        });
    }

    private function exigirMunicipe(int $id): void
    {
        if (!$this->municipes->existe($id)) {
            throw new ErroDeNegocio('Munícipe não encontrado', 404);
        }
    }

    private function validar(array $dados, ?int $municipeId): array
    {
        $nome = Validador::textoObrigatorio($dados['nome'] ?? '', 120, 'Informe o nome completo (até 120 caracteres)');
        $cpf = $this->somenteDigitos((string) ($dados['cpf'] ?? ''));
        $nis = $this->somenteDigitos((string) ($dados['nis'] ?? ''));
        $dataNascimento = (string) ($dados['dataNascimento'] ?? '');
        $telefone = Validador::telefoneOpcional($dados['telefone'] ?? '');
        $familiaId = (int) ($dados['familiaId'] ?? 0);
        $rendaMensal = $dados['rendaMensal'] ?? 0;

        if (!$this->cpfValido($cpf)) {
            throw new ErroDeNegocio('O CPF informado não é válido. Confira os dígitos verificadores.');
        }

        if ($nis !== '' && strlen($nis) !== 11) {
            throw new ErroDeNegocio('O NIS deve ter 11 dígitos');
        }

        if (!$this->dataNoPassado($dataNascimento)) {
            throw new ErroDeNegocio('Informe uma data de nascimento válida');
        }

        $this->exigirOpcao($dados['sexo'] ?? null, self::SEXOS, 'Selecione o sexo');
        $this->exigirOpcao($dados['parentesco'] ?? null, self::PARENTESCOS, 'Selecione o parentesco');

        if (!$this->familias->existe($familiaId)) {
            throw new ErroDeNegocio('Selecione a família');
        }

        if (!is_numeric($rendaMensal) || $rendaMensal < 0) {
            throw new ErroDeNegocio('Informe uma renda mensal válida');
        }

        $this->exigirOpcao($dados['escolaridade'] ?? null, self::ESCOLARIDADES, 'Selecione a escolaridade');

        $ocupacao = Validador::textoObrigatorio($dados['ocupacao'] ?? '', 80, 'Informe a ocupação (até 80 caracteres)');

        $this->exigirOpcao($dados['tipoMoradia'] ?? null, self::TIPOS_DE_MORADIA, 'Selecione o tipo de moradia');

        if ($this->municipes->cpfEmUso($cpf, $municipeId)) {
            throw new ErroDeNegocio('Este CPF já possui cadastro na rede', 409);
        }

        if ($nis !== '' && $this->municipes->nisEmUso($nis, $municipeId)) {
            throw new ErroDeNegocio('Este NIS já possui cadastro na rede', 409);
        }

        return [
            'municipe' => [
                'familia_id' => $familiaId,
                'nome' => $nome,
                'cpf' => $cpf,
                'nis' => $nis === '' ? null : $nis,
                'data_nascimento' => $dataNascimento,
                'sexo' => $dados['sexo'],
                'parentesco' => $dados['parentesco'],
                'telefone' => $telefone,
            ],
            'socioeconomico' => [
                'renda_mensal' => (float) $rendaMensal,
                'escolaridade' => $dados['escolaridade'],
                'ocupacao' => $ocupacao,
                'tipo_moradia' => $dados['tipoMoradia'],
            ],
        ];
    }

    private function emTransacao(callable $operacao): mixed
    {
        $conexao = $this->banco->getDriver()->getConnection();
        $conexao->beginTransaction();

        try {
            $resultado = $operacao();
            $conexao->commit();

            return $resultado;
        } catch (Throwable $erro) {
            $conexao->rollback();

            throw $erro;
        }
    }

    private function exigirOpcao(mixed $valor, array $opcoes, string $mensagem): void
    {
        if (!in_array($valor, $opcoes, true)) {
            throw new ErroDeNegocio($mensagem);
        }
    }

    private function dataNoPassado(string $dataEmTexto): bool
    {
        $convertida = DateTimeImmutable::createFromFormat('!Y-m-d', $dataEmTexto);

        return $convertida !== false
            && $convertida->format('Y-m-d') === $dataEmTexto
            && $convertida <= new DateTimeImmutable('today');
    }

    private function cpfValido(string $cpf): bool
    {
        if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        for ($posicao = 9; $posicao < 11; $posicao++) {
            $soma = 0;

            for ($indice = 0; $indice < $posicao; $indice++) {
                $soma += (int) $cpf[$indice] * ($posicao + 1 - $indice);
            }

            if ((int) $cpf[$posicao] !== ($soma * 10) % 11 % 10) {
                return false;
            }
        }

        return true;
    }

    private function somenteDigitos(string $texto): string
    {
        return preg_replace('/\D/', '', $texto);
    }
}
