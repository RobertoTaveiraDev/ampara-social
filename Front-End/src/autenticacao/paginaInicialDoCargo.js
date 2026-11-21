const paginasIniciais = {
  gestor: '/gestao',
  admin: '/administracao',
}

export function paginaInicialDoCargo(cargo) {
  return paginasIniciais[cargo] ?? '/'
}
