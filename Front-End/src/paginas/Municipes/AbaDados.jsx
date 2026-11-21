import { formatarData, formatarMoeda } from '../../utilitarios/formatos.js'

export default function AbaDados({ municipe }) {
  const { familia, socioeconomico } = municipe

  return (
    <div className="two-column">
      <article className="card">
        <h2>Dados pessoais</h2>
        <dl>
          <dt>Data de nascimento</dt>
          <dd>{formatarData(municipe.dataNascimento)}</dd>
          <dt>Sexo</dt>
          <dd>{municipe.sexo}</dd>
          <dt>NIS</dt>
          <dd className="mono">{municipe.nis ?? 'Não informado'}</dd>
          <dt>Telefone</dt>
          <dd>{municipe.telefone ?? 'Não informado'}</dd>
          <dt>Parentesco</dt>
          <dd>{municipe.parentesco}</dd>
          <dt>Endereço</dt>
          <dd>
            {familia.endereco} · {familia.bairro}
          </dd>
        </dl>
      </article>
      <article className="card">
        <h2>Dados socioeconômicos</h2>
        <dl>
          <dt>Renda mensal familiar</dt>
          <dd>{formatarMoeda(socioeconomico.rendaMensal)}</dd>
          <dt>Escolaridade</dt>
          <dd>{socioeconomico.escolaridade}</dd>
          <dt>Ocupação</dt>
          <dd>{socioeconomico.ocupacao}</dd>
          <dt>Tipo de moradia</dt>
          <dd>{socioeconomico.tipoMoradia}</dd>
        </dl>
      </article>
    </div>
  )
}
