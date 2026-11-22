import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'

const tiposDeUnidade = ['CRAS', 'CREAS', 'CAPS']

export default function PaginaFormularioUnidade() {
  const { id } = useParams()
  const editando = id !== undefined
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState({ nome: '', tipo: '' })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (editando) {
      requisitar(`/unidades/${id}`)
        .then(setFormulario)
        .catch((falha) => setErro(falha.message))
    }
  }, [editando, id])

  function alterar(evento) {
    const { name, value } = evento.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      await requisitar(editando ? `/unidades/${id}` : '/unidades', {
        metodo: editando ? 'PUT' : 'POST',
        corpo: formulario,
      })
      navigate('/unidades')
    } catch (falha) {
      setErro(falha.message)
      setSalvando(false)
    }
  }

  return (
    <>
      <TituloPagina
        titulo={editando ? 'Editar unidade' : 'Nova unidade'}
        descricao="As unidades aparecem no cadastro de usuários."
      />
      <form className="card form-card" onSubmit={salvar}>
        <div className="form-grid">
          <label>
            Nome *
            <input name="nome" value={formulario.nome} onChange={alterar} maxLength={100} />
          </label>
          <label>
            Tipo *
            <select name="tipo" value={formulario.tipo} onChange={alterar}>
              <option value="">Selecione</option>
              {tiposDeUnidade.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </select>
          </label>
        </div>
        {erro && <p className="alert error">{erro}</p>}
        <footer className="form-actions">
          <Link className="button secondary" to="/unidades">
            Cancelar
          </Link>
          <Botao type="submit" disabled={salvando}>
            Salvar
          </Botao>
        </footer>
      </form>
    </>
  )
}
