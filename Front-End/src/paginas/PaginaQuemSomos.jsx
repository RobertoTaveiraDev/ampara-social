import TituloPagina from '../componentes/TituloPagina.jsx'

const integrantes = [
  { nome: 'Roberto Alves Taveira Neto', ra: '221366' },
  { nome: 'Felipe Correia de Souza Prado', ra: '221512' },
]

export default function PaginaQuemSomos() {
  return (
    <>
      <TituloPagina
        titulo="Quem Somos"
        descricao="Projeto da disciplina de Web Avançada da UniSALESIANO, feito com React e Laminas."
      />
      <div className="team">
        {integrantes.map((integrante) => (
          <article key={integrante.ra} className="card">
            <h2>{integrante.nome}</h2>
            <p className="mono">RA {integrante.ra}</p>
          </article>
        ))}
      </div>
    </>
  )
}
