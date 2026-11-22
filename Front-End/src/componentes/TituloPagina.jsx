export default function TituloPagina({ titulo, descricao, children }) {
  return (
    <header className="page-title">
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
      {children}
    </header>
  )
}
