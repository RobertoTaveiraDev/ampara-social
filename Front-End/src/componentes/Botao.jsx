const classesDasVariantes = {
  principal: 'primary',
  secundario: 'secondary',
  perigo: 'danger',
}

export default function Botao({ variante = 'principal', children, ...propriedades }) {
  return (
    <button className={`button ${classesDasVariantes[variante]}`} {...propriedades}>
      {children}
    </button>
  )
}
