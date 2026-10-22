import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../wallet/context'

/** Cierra sesión y desconecta la wallet para evitar un re-login automático. */
export function useLogout() {
  const { logout } = useAuth()
  const wallet = useWallet()
  return useCallback(() => {
    wallet.disconnect()
    logout()
  }, [wallet, logout])
}
