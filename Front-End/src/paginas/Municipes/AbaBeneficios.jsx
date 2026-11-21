import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import { useAutenticacao } from '../../autenticacao/useAutenticacao.js'
import Botao from '../../componentes/Botao.jsx'
import { formatarData } from '../../utilitarios/formatos.js'

function buscarEntregas(municipeId) {
  return requisitar(`/municipes/${municipeId}/entregas`)
}

export default function AbaBeneficios({ municipeId }) {
  const { usuario } = useAutenticacao()
  const [entregas, setEntregas] = useState([])
  const [beneficios, setBeneficios] = useState([])
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [entregaEmEdicao, setEntregaEmEdicao] = useState(null)
  const [beneficioId, setBeneficioId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    buscarEntregas(municipeId)
      .then(setEntregas)
      .catch((falha) => setErro(falha.message))
    requisitar('/beneficios').then(setBeneficios)
  }, [municipeId])

  function abrirFormulario(entrega) {
    setErro('')
    setEntregaEmEdicao(entrega?.id ?? null)
    setBeneficioId(entrega ? String(entrega.beneficioId) : '')
    setQuantidade(entrega ? String(entrega.quantidade) : '1')
    setFormularioAberto(true)
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      await requisitar(
        entregaEmEdicao ? `/municipes/${municipeId}/entregas/${entregaEmEdicao}` : `/municipes/${municipeId}/entregas`,
        {
          metodo: entregaEmEdicao ? 'PUT' : 'POST',
          corpo: { beneficioId: Number(beneficioId), quantidade: Number(quantidade) },
        }
      )
      setEntregas(await buscarEntregas(municipeId))
      setFormularioAberto(false)
    } catch (falha) {
      setErro(falha.message)
    }

    setSalvando(false)
  }

  async function excluir(entrega) {
    if (!window.confirm(`Excluir a entrega de ${entrega.beneficio}?`)) {
      return
    }

    setErro('')

    try {
      await requisitar(`/municipes/${municipeId}/entregas/${entrega.id}`, { metodo: 'DELETE' })
      setEntregas(await buscarEntregas(municipeId))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  return (
    <>
      <div className="section-head">
        <p className="muted">
          Entregas de todas as unidades da rede. Só a unidade que registrou pode editar ou excluir.
        </p>
        {!formularioAberto && (
          <Botao onClick={() => abrirFormulario(null)}>
            <Plus size={17} /> Registrar entrega
          </Botao>
        )}
      </div>
      {formularioAberto && (
        <form className="card form-card" onSubmit={salvar}>
          <h2>{entregaEmEdicao ? 'Editar entrega' : 'Registrar entrega'}</h2>
          <div className="form-grid">
            <label>
              Benefício *
              <select value={beneficioId} onChange={(evento) => setBeneficioId(evento.target.value)}>
                <option value="">Selecione</option>
                {beneficios.map((beneficio) => (
                  <option key={beneficio.id} value={beneficio.id}>
                    {beneficio.nome}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quantidade *
              <input
                type="number"
                min="1"
                max="1000"
                value={quantidade}
                onChange={(evento) => setQuantidade(evento.target.value)}
              />
            </label>
          </div>
          <footer className="form-actions">
            <Botao type="button" variante="secundario" onClick={() => setFormularioAberto(false)}>
              Cancelar
            </Botao>
            <Botao type="submit" disabled={salvando}>
              Salvar entrega
            </Botao>
          </footer>
        </form>
      )}
      {erro && <p className="alert error">{erro}</p>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Benefício</th>
              <th>Quantidade</th>
              <th>Unidade</th>
              <th>Profissional</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {entregas.map((entrega) => (
              <tr key={entrega.id}>
                <td>{formatarData(entrega.dataEntrega)}</td>
                <td>{entrega.beneficio}</td>
                <td>{entrega.quantidade}</td>
                <td>{entrega.unidade}</td>
                <td>{entrega.profissional}</td>
                <td className="actions">
                  {entrega.unidadeId === usuario.unidadeId && (
                    <>
                      <Botao variante="secundario" onClick={() => abrirFormulario(entrega)}>
                        <Pencil size={15} /> Editar
                      </Botao>
                      <Botao variante="perigo" onClick={() => excluir(entrega)}>
                        <Trash2 size={15} /> Excluir
                      </Botao>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {entregas.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  Nenhuma entrega registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
