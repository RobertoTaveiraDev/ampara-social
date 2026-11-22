import { useContext } from 'react'
import { ContextoAutenticacao } from './ContextoAutenticacao.js'

export function useAutenticacao() {
  return useContext(ContextoAutenticacao)
}
