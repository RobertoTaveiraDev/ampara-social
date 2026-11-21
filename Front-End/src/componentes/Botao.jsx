export default function Botao({ children, ...propriedades }) {
  return (
    <button className="button primary" {...propriedades}>
      {children}
    </button>
  )
}
