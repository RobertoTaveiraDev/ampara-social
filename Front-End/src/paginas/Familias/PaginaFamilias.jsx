import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'

function buscarFamilias(texto) {
  return requisitar(`/familias?busca=${encodeURIComponent(texto)}`)
}

export default function PaginaFamilias() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [familias, setFamilias] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarFamilias('')
      .then(setFamilias)
      .catch((falha) => setErro(falha.message))
  }, [])

  async function buscar(evento) {
    evento.preventDefault()
    setErro('')

    try {
      setFamilias(await buscarFamilias(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  async function excluir(familia) {
    if (!window.confirm(`Excluir a família de ${familia.endereco}?`)) {
      return
    }

    setErro('')

    try {
      await requisitar(`/familias/${familia.id}`, { metodo: 'DELETE' })
      setFamilias(await buscarFamilias(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  return (
    <>
      <TituloPagina titulo="Famílias" descricao="Endereços e composição familiar usados no cadastro de munícipes.">
        <Botao onClick={() => navigate('/familias/nova')}>
          <Plus size={17} /> Nova família
        </Botao>
      </TituloPagina>
      <form className="search-bar" onSubmit={buscar}>
        <input
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar por endereço ou responsável"
        />
        <Botao type="submit">
          <Search size={17} /> Buscar
        </Botao>
      </form>
      {erro && <p className="alert error">{erro}</p>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Endereço</th>
              <th>Bairro</th>
              <th>Telefone</th>
              <th>Responsável</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {familias.map((familia) => (
              <tr key={familia.id}>
                <td>{familia.endereco}</td>
                <td>{familia.bairro}</td>
                <td>{familia.telefone ?? '—'}</td>
                <td>{familia.responsavel ?? '—'}</td>
                <td className="actions">
                  <Botao variante="secundario" onClick={() => navigate(`/familias/${familia.id}/editar`)}>
                    <Pencil size={15} /> Editar
                  </Botao>
                  <Botao variante="perigo" onClick={() => excluir(familia)}>
                    <Trash2 size={15} /> Excluir
                  </Botao>
                </td>
              </tr>
            ))}
            {familias.length === 0 && (
              <tr>
                <td colSpan="5" className="muted">
                  Nenhuma família cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
