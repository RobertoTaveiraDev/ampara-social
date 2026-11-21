export function iniciaisDoNome(nome) {
  return nome
    .split(' ')
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
}
