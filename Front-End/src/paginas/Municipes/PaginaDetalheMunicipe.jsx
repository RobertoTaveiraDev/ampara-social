import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'
import { formatarCpf, formatarData } from '../../utilitarios/formatos.js'
import AbaAtendimentos from './AbaAtendimentos.jsx'
import AbaBeneficios from './AbaBeneficios.jsx'
import AbaDados from './AbaDados.jsx'

const abas = [
  { chave: 'dados', rotulo: 'Dados' },
  { chave: 'atendimentos', rotulo: 'Atendimentos' },
  { chave: 'beneficios', rotulo: 'Benefícios' },
]

export default function PaginaDetalheMunicipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [municipe, setMunicipe] = useState(null)
  const [erro, setErro] = useState('')
  const [abaAtual, setAbaAtual] = useState('dados')

  useEffect(() => {
    requisitar(`/municipes/${id}`)
      .then(setMunicipe)
      .catch((falha) => setErro(falha.message))
  }, [id])

  if (erro) {
    return <p className="alert error">{erro}</p>
  }

  if (!municipe) {
    return null
  }

  return (
    <>
      <Link className="back-link" to="/municipes">
        <ArrowLeft size={16} /> Voltar para a lista
      </Link>
      <TituloPagina
        titulo={municipe.nome}
        descricao={`CPF ${formatarCpf(municipe.cpf)} · Nascimento em ${formatarData(municipe.dataNascimento)}`}
      >
        <Botao variante="secundario" onClick={() => navigate(`/municipes/${id}/editar`)}>
          <Pencil size={16} /> Editar
        </Botao>
      </TituloPagina>
      <nav className="tabs">
        {abas.map((aba) => (
          <button
            key={aba.chave}
            className={abaAtual === aba.chave ? 'active' : ''}
            onClick={() => setAbaAtual(aba.chave)}
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>
      {abaAtual === 'dados' && <AbaDados municipe={municipe} />}
      {abaAtual === 'atendimentos' && <AbaAtendimentos municipeId={municipe.id} />}
      {abaAtual === 'beneficios' && <AbaBeneficios municipeId={municipe.id} />}
    </>
  )
}
