import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../wallet/context'

export default function LoginPage() {
  const { user, login, loginWithWallet } = useAuth()
  const wallet = useWallet()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  useEffect(() => {
    if (!user && wallet.isConnected && wallet.address) {
      loginWithWallet(wallet.address).catch((e: unknown) => setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.'))
    }
  }, [user, wallet.isConnected, wallet.address, loginWithWallet])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <aside className="login__hero">
        <Logo tagline />
        <div className="login__headline">
          <h1>Tu bot opera 24/7. Tú controlas cada movimiento.</h1>
          <p>Consulta balances, operaciones y rendimiento por estrategia en tiempo real desde un solo panel.</p>
        </div>
        <div className="login__metrics">
          <div className="login__metric">
            <span>Rendimiento 30D</span>
            <strong className="pos">+12.47%</strong>
          </div>
          <div className="login__metric">
            <span>Tasa de acierto</span>
            <strong>86%</strong>
          </div>
        </div>
      </aside>

      <div className="login__panel">
        <div className="login__form">
          <div className="login__mobile-brand">
            <Logo />
          </div>
          <header>
            <h2>Iniciar sesión</h2>
            <p>Accede a tu panel de trading.</p>
          </header>

          <form className="fields" onSubmit={onSubmit} noValidate>
            <label className="field">
              Correo electrónico
              <input className="input" type="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field">
              <span className="field__row">
                <span>Contraseña</span>
                <a href="#">¿La olvidaste?</a>
              </span>
              <input className="input" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
              {loading && <span className="spinner spinner--sm" />}
              Iniciar sesión
            </button>
          </form>

          <div className="divider">o</div>

          <button type="button" className="btn btn--lg" onClick={wallet.open}>
            <Icon name="wallet" />
            Continuar con WalletConnect
          </button>

          <p className="small muted center">
            ¿No tienes cuenta? <a href="#">Crear cuenta</a>
          </p>
        </div>
      </div>
    </div>
  )
}
