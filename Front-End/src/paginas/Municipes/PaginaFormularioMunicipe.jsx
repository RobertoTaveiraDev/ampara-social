import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'
import { formatarCpf, formatarTelefone, somenteDigitos } from '../../utilitarios/formatos.js'

const sexos = ['Feminino', 'Masculino', 'Outro', 'Prefere não informar']
const parentescos = ['Responsável familiar', 'Cônjuge', 'Filho(a)', 'Outro']
const escolaridades = [
  'Não alfabetizado',
  'Ensino fundamental incompleto',
  'Ensino fundamental completo',
  'Ensino médio completo',
  'Ensino superior',
]
const tiposDeMoradia = ['Própria', 'Alugada', 'Cedida', 'Ocupação']

const formularioEmBranco = {
  nome: '',
  cpf: '',
  nis: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  parentesco: 'Responsável familiar',
  familiaId: 'nova',
  endereco: '',
  bairro: '',
  rendaMensal: '',
  escolaridade: '',
  ocupacao: '',
  tipoMoradia: '',
}

function formularioDoMunicipe(municipe) {
  return {
    ...formularioEmBranco,
    nome: municipe.nome,
    cpf: formatarCpf(municipe.cpf),
    nis: municipe.nis ?? '',
    dataNascimento: municipe.dataNascimento,
    sexo: municipe.sexo,
    telefone: municipe.telefone ?? '',
    parentesco: municipe.parentesco,
    familiaId: String(municipe.familia.id),
    rendaMensal: String(municipe.socioeconomico.rendaMensal),
    escolaridade: municipe.socioeconomico.escolaridade,
    ocupacao: municipe.socioeconomico.ocupacao,
    tipoMoradia: municipe.socioeconomico.tipoMoradia,
  }
}

function valorDoCampo(campo, valor) {
  if (campo === 'cpf') {
    return formatarCpf(valor)
  }

  if (campo === 'nis') {
    return somenteDigitos(valor).slice(0, 11)
  }

  if (campo === 'telefone') {
    return formatarTelefone(valor)
  }

  return valor
}

export default function PaginaFormularioMunicipe() {
  const { id } = useParams()
  const editando = id !== undefined
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioEmBranco)
  const [familias, setFamilias] = useState([])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    requisitar('/familias').then(setFamilias)
  }, [])

  useEffect(() => {
    if (editando) {
      requisitar(`/municipes/${id}`)
        .then((municipe) => setFormulario(formularioDoMunicipe(municipe)))
        .catch((falha) => setErro(falha.message))
    }
  }, [editando, id])

  function alterar(evento) {
    const { name, value } = evento.target
    setFormulario((atual) => ({ ...atual, [name]: valorDoCampo(name, value) }))
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)

    const corpo = {
      ...formulario,
      cpf: somenteDigitos(formulario.cpf),
      familiaId: formulario.familiaId === 'nova' ? null : Number(formulario.familiaId),
      rendaMensal: Number(formulario.rendaMensal || 0),
    }

    try {
      const resposta = await requisitar(editando ? `/municipes/${id}` : '/municipes', {
        metodo: editando ? 'PUT' : 'POST',
        corpo,
      })
      navigate(`/municipes/${resposta.id}`)
    } catch (falha) {
      setErro(falha.message)
      setSalvando(false)
    }
  }

  return (
    <>
      <TituloPagina
        titulo={editando ? 'Editar munícipe' : 'Novo munícipe'}
        descricao="Os dados cadastrais são compartilhados com toda a rede municipal."
      />
      <form className="card form-card" onSubmit={salvar}>
        <h2>Dados pessoais</h2>
        <div className="form-grid">
          <label className="span-2">
            Nome completo *
            <input name="nome" value={formulario.nome} onChange={alterar} maxLength={120} />
          </label>
          <label>
            CPF *
            <input name="cpf" className="mono" value={formulario.cpf} onChange={alterar} placeholder="000.000.000-00" />
          </label>
          <label>
            NIS
            <input name="nis" className="mono" value={formulario.nis} onChange={alterar} />
          </label>
          <label>
            Data de nascimento *
            <input name="dataNascimento" type="date" value={formulario.dataNascimento} onChange={alterar} />
          </label>
          <label>
            Sexo *
            <select name="sexo" value={formulario.sexo} onChange={alterar}>
              <option value="">Selecione</option>
              {sexos.map((sexo) => (
                <option key={sexo}>{sexo}</option>
              ))}
            </select>
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

        <h2>Família</h2>
        <div className="form-grid">
          <label className="span-2">
            Família *
            <select name="familiaId" value={formulario.familiaId} onChange={alterar}>
              <option value="nova">Nova família</option>
              {familias.map((familia) => (
                <option key={familia.id} value={familia.id}>
                  {familia.endereco} · {familia.bairro}
                  {familia.responsavel && ` · ${familia.responsavel}`}
                </option>
              ))}
            </select>
          </label>
          {formulario.familiaId === 'nova' && (
            <>
              <label>
                Endereço *
                <input name="endereco" value={formulario.endereco} onChange={alterar} maxLength={150} />
              </label>
              <label>
                Bairro *
                <input name="bairro" value={formulario.bairro} onChange={alterar} maxLength={80} />
              </label>
            </>
          )}
          <label>
            Parentesco *
            <select name="parentesco" value={formulario.parentesco} onChange={alterar}>
              {parentescos.map((parentesco) => (
                <option key={parentesco}>{parentesco}</option>
              ))}
            </select>
          </label>
        </div>

        <h2>Dados socioeconômicos</h2>
        <div className="form-grid">
          <label>
            Renda mensal (R$)
            <input
              name="rendaMensal"
              type="number"
              min="0"
              step="0.01"
              value={formulario.rendaMensal}
              onChange={alterar}
            />
          </label>
          <label>
            Escolaridade *
            <select name="escolaridade" value={formulario.escolaridade} onChange={alterar}>
              <option value="">Selecione</option>
              {escolaridades.map((escolaridade) => (
                <option key={escolaridade}>{escolaridade}</option>
              ))}
            </select>
          </label>
          <label>
            Ocupação *
            <input name="ocupacao" value={formulario.ocupacao} onChange={alterar} maxLength={80} />
          </label>
          <label>
            Tipo de moradia *
            <select name="tipoMoradia" value={formulario.tipoMoradia} onChange={alterar}>
              <option value="">Selecione</option>
              {tiposDeMoradia.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </select>
          </label>
        </div>

        {erro && <p className="alert error">{erro}</p>}
        <footer className="form-actions">
          <Link className="button secondary" to={editando ? `/municipes/${id}` : '/municipes'}>
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
