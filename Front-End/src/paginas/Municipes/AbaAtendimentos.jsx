import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import { useAutenticacao } from '../../autenticacao/useAutenticacao.js'
import Botao from '../../componentes/Botao.jsx'
import { formatarData } from '../../utilitarios/formatos.js'

const tiposDeAtendimento = [
  'Acolhimento',
  'Atendimento individual',
  'Acompanhamento familiar',
  'Visita domiciliar',
  'Escuta especializada',
]

function buscarAtendimentos(municipeId) {
  return requisitar(`/municipes/${municipeId}/atendimentos`)
}

export default function AbaAtendimentos({ municipeId }) {
  const { usuario } = useAutenticacao()
  const [atendimentos, setAtendimentos] = useState([])
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [atendimentoEmEdicao, setAtendimentoEmEdicao] = useState(null)
  const [tipo, setTipo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    buscarAtendimentos(municipeId)
      .then(setAtendimentos)
      .catch((falha) => setErro(falha.message))
  }, [municipeId])

  function abrirFormulario(atendimento) {
    setErro('')
    setAtendimentoEmEdicao(atendimento?.id ?? null)
    setTipo(atendimento?.tipo ?? '')
    setDescricao(atendimento?.descricao ?? '')
    setFormularioAberto(true)
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      await requisitar(
        atendimentoEmEdicao
          ? `/municipes/${municipeId}/atendimentos/${atendimentoEmEdicao}`
          : `/municipes/${municipeId}/atendimentos`,
        { metodo: atendimentoEmEdicao ? 'PUT' : 'POST', corpo: { tipo, descricao } }
      )
      setAtendimentos(await buscarAtendimentos(municipeId))
      setFormularioAberto(false)
    } catch (falha) {
      setErro(falha.message)
    }

    setSalvando(false)
  }

  async function excluir(atendimento) {
    if (!window.confirm(`Excluir o atendimento "${atendimento.tipo}"?`)) {
      return
    }

    setErro('')

    try {
      await requisitar(`/municipes/${municipeId}/atendimentos/${atendimento.id}`, { metodo: 'DELETE' })
      setAtendimentos(await buscarAtendimentos(municipeId))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  return (
    <>
      <div className="section-head">
        <p className="muted">
          Você vê apenas os atendimentos registrados por <strong>{usuario.unidadeNome}</strong>.
        </p>
        {!formularioAberto && (
          <Botao onClick={() => abrirFormulario(null)}>
            <Plus size={17} /> Novo atendimento
          </Botao>
        )}
      </div>
      {formularioAberto && (
        <form className="card form-card" onSubmit={salvar}>
          <h2>{atendimentoEmEdicao ? 'Editar atendimento' : 'Novo atendimento'}</h2>
          <label>
            Tipo de atendimento *
            <select value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
              <option value="">Selecione</option>
              {tiposDeAtendimento.map((tipoDeAtendimento) => (
                <option key={tipoDeAtendimento}>{tipoDeAtendimento}</option>
              ))}
            </select>
          </label>
          <label>
            Descrição *
            <textarea
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
              rows={5}
              maxLength={5000}
            />
          </label>
          <footer className="form-actions">
            <Botao type="button" variante="secundario" onClick={() => setFormularioAberto(false)}>
              Cancelar
            </Botao>
            <Botao type="submit" disabled={salvando}>
              Salvar atendimento
            </Botao>
          </footer>
        </form>
      )}
      {erro && <p className="alert error">{erro}</p>}
      {atendimentos.map((atendimento) => (
        <article key={atendimento.id} className="card registro">
          <header>
            <div>
              <strong>{atendimento.tipo}</strong>
              <span className="muted">
                {' '}
                · {formatarData(atendimento.dataAtendimento)} · {atendimento.profissional}
              </span>
            </div>
            <div className="actions">
              <Botao variante="secundario" onClick={() => abrirFormulario(atendimento)}>
                <Pencil size={15} /> Editar
              </Botao>
              <Botao variante="perigo" onClick={() => excluir(atendimento)}>
                <Trash2 size={15} /> Excluir
              </Botao>
            </div>
          </header>
          <p>{atendimento.descricao}</p>
        </article>
      ))}
      {atendimentos.length === 0 && <p className="muted">Nenhum atendimento desta unidade para este munícipe.</p>}
    </>
  )
}
