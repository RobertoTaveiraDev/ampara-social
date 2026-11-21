import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'
import { formatarCpf, formatarData } from '../../utilitarios/formatos.js'
import AbaDados from './AbaDados.jsx'

export default function PaginaDetalheMunicipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [municipe, setMunicipe] = useState(null)
  const [erro, setErro] = useState('')

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
      <AbaDados municipe={municipe} />
    </>
  )
}
