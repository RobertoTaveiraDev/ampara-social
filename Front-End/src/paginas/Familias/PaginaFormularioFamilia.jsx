import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'
import { formatarTelefone } from '../../utilitarios/formatos.js'

const formularioEmBranco = { endereco: '', bairro: '', telefone: '' }

export default function PaginaFormularioFamilia() {
  const { id } = useParams()
  const editando = id !== undefined
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioEmBranco)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (editando) {
      requisitar(`/familias/${id}`)
        .then((familia) => setFormulario({ ...familia, telefone: familia.telefone ?? '' }))
        .catch((falha) => setErro(falha.message))
    }
  }, [editando, id])

  function alterar(evento) {
    const { name, value } = evento.target
    setFormulario((atual) => ({ ...atual, [name]: name === 'telefone' ? formatarTelefone(value) : value }))
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      await requisitar(editando ? `/familias/${id}` : '/familias', {
        metodo: editando ? 'PUT' : 'POST',
        corpo: formulario,
      })
      navigate('/familias')
    } catch (falha) {
      setErro(falha.message)
      setSalvando(false)
    }
  }

  return (
    <>
      <TituloPagina
        titulo={editando ? 'Editar família' : 'Nova família'}
        descricao="Depois de cadastrada, a família aparece no formulário do munícipe."
      />
      <form className="card form-card" onSubmit={salvar}>
        <div className="form-grid">
          <label className="span-2">
            Endereço *
            <input name="endereco" value={formulario.endereco} onChange={alterar} maxLength={150} />
          </label>
          <label>
            Bairro *
            <input name="bairro" value={formulario.bairro} onChange={alterar} maxLength={80} />
          </label>
          <label>
            Telefone
            <input
              name="telefone"
              value={formulario.telefone}
              onChange={alterar}
              placeholder="(18) 99999-9999"
              maxLength={15}
            />
          </label>
        </div>
        {erro && <p className="alert error">{erro}</p>}
        <footer className="form-actions">
          <Link className="button secondary" to="/familias">
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
