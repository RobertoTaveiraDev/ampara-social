import { ShieldCheck } from 'lucide-react'
import Logo from '../../componentes/Logo.jsx'

export default function ApresentacaoLogin() {
  return (
    <section className="login-story">
      <Logo fundoEscuro />
      <div className="login-copy">
        <p className="eyebrow light">ATENDIMENTO MUNICIPAL INTEGRADO</p>
        <h1>A rede de proteção social, conectada e com sigilo.</h1>
      </div>
      <div className="embrace-art" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="login-note">
        <ShieldCheck size={18} /> Dados protegidos e acessos registrados
      </p>
    </section>
  )
}
