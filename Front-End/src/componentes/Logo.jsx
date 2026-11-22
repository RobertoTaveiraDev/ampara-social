export default function Logo({ fundoEscuro = false }) {
  const corDaEsquerda = fundoEscuro ? '#8FC1CC' : '#0F4C5C'
  const corDaDireita = fundoEscuro ? '#E58A6F' : '#C8553D'

  return (
    <div className="brand">
      <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 33C11 27.5 6 21 6 14.5a7.5 7.5 0 0 1 14-3.8"
          stroke={corDaEsquerda}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M20 33c9-5.5 14-12 14-18.5a7.5 7.5 0 0 0-14-3.8"
          stroke={corDaDireita}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <strong>AMPARA</strong>
        <span>SOCIAL</span>
      </div>
    </div>
  )
}
