import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'

const formularioEmBranco = { nome: '', email: '', funcao: '', perfil: 'servidor', unidadeId: '', senha: '' }

export default function PaginaFormularioUsuario() {
  const { id } = useParams()
  const editando = id !== undefined
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioEmBranco)
  const [unidades, setUnidades] = useState([])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    requisitar('/unidades')
      .then(setUnidades)
      .catch((falha) => setErro(falha.message))
  }, [])

  useEffect(() => {
    if (editando) {
      requisitar(`/usuarios/${id}`)
        .then((usuario) =>
          setFormulario({ ...formularioEmBranco, ...usuario, unidadeId: String(usuario.unidadeId ?? '') })
        )
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
      await requisitar(editando ? `/usuarios/${id}` : '/usuarios', {
        metodo: editando ? 'PUT' : 'POST',
        corpo: { ...formulario, unidadeId: Number(formulario.unidadeId) },
      })
      navigate('/usuarios')
    } catch (falha) {
      setErro(falha.message)
      setSalvando(false)
    }
  }

  return (
    <>
      <TituloPagina
        titulo={editando ? 'Editar usuário' : 'Novo usuário'}
        descricao="Servidores trabalham em uma unidade; gestores cuidam de usuários e unidades."
      />
      <form className="card form-card" onSubmit={salvar}>
        <div className="form-grid">
          <label className="span-2">
            Nome *
            <input name="nome" value={formulario.nome} onChange={alterar} maxLength={100} />
          </label>
          <label>
            E-mail *
            <input name="email" type="email" value={formulario.email} onChange={alterar} maxLength={150} />
          </label>
          <label>
            Função *
            <input
              name="funcao"
              value={formulario.funcao}
              onChange={alterar}
              maxLength={60}
              placeholder="Ex.: Assistente social"
            />
          </label>
          <label>
            Perfil *
            <select name="perfil" value={formulario.perfil} onChange={alterar}>
              <option value="servidor">Servidor de unidade</option>
              <option value="gestor">Gestor geral</option>
            </select>
          </label>
          {formulario.perfil === 'servidor' && (
            <label>
              Unidade *
              <select name="unidadeId" value={formulario.unidadeId} onChange={alterar}>
                <option value="">Selecione</option>
                {unidades.map((unidade) => (
                  <option key={unidade.id} value={unidade.id}>
                    {unidade.nome} ({unidade.tipo})
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            {editando ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}
            <input name="senha" type="password" value={formulario.senha} onChange={alterar} autoComplete="new-password" />
          </label>
        </div>
        {erro && <p className="alert error">{erro}</p>}
        <footer className="form-actions">
          <Link className="button secondary" to="/usuarios">
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
