# TradePro AI · Frontend

Dashboard para el bot de trading. React 18 + TypeScript + Vite.

## Requisitos

- Node.js 18 o superior

## Instalación

~~~bash
npm install
cp .env.example .env
npm run dev
~~~

Abre http://localhost:5173. Para entrar usa cualquier correo válido y una contraseña de 4+ caracteres (modo demo).

## Scripts

- `npm run dev` servidor de desarrollo
- `npm run build` verifica tipos y genera `dist/`
- `npm run preview` sirve el build
- `npm run typecheck` solo verificación de tipos

## Variables de entorno

- `VITE_WC_PROJECT_ID` Project ID de WalletConnect (https://cloud.reown.com). Si está vacío se usa un modal de wallet simulado.
- `VITE_API_URL` URL base del backend del bot.

## Estructura

~~~
src/
  App.tsx                 Rutas (login, dashboard, operaciones, movimientos, perfil)
  config.ts               Nombre de la app, SHOW_COP
  types.ts                Tipos de dominio (Trade, Position, Movement, Summary…)
  config/navigation.ts    Menú lateral y barra inferior móvil
  context/                AuthContext (sesión), BotContext (pausar/reanudar)
  wallet/                 WalletConnect real (AppKit + wagmi) o simulado
  services/api.ts         Capa de datos. Reemplaza los mocks por tu API aquí
  services/mock.ts        Datos de ejemplo
  hooks/                  useAsync, useLogout
  lib/                    Formato de números/fechas, paths SVG para gráficos
  components/             KPI, gráfico de capital, donut, tablas, modal, layout
  pages/                  Pantallas
  styles/global.css       Tokens de color y estilos (responsive: < 900px = móvil)
~~~

## Conectar el backend

Cada método de `src/services/api.ts` tiene comentada la llamada real con `request()`, que añade el token de sesión como `Authorization: Bearer`. Endpoints sugeridos:

- `POST /auth/login` → `User`
- `POST /auth/wallet` → `User` (recomendado: firma SIWE)
- `GET /summary?period=30D` → `Summary`
- `GET /equity?period=30D` → `EquityPoint[]`
- `GET /strategies`, `GET /positions`, `GET /trades`, `GET /movements`
- `PATCH /bot` `{ running: boolean }`

Las formas de cada respuesta están en `src/types.ts`.

## WalletConnect

Toda la configuración está en [`src/wallet/config.ts`](src/wallet/config.ts):

- **Wallets destacadas:** Core y MetaMask aparecen primero (`FEATURED_WALLET_IDS`).
- **Resto de wallets:** el botón "Todas las wallets" muestra las 500+ del registro de WalletConnect (Trust, Coinbase, Rabby, OKX, Ledger…). También se detectan las extensiones instaladas en el navegador y se puede escanear un QR con wallets móviles.
- **Redes:** Ethereum, Avalanche, Polygon, Arbitrum, Base, Optimism y BNB Chain (`NETWORKS`; la primera es la red por defecto).
- **Tema:** modal negro con el acento azul de la app (`THEME_VARIABLES`).
- **Modo demo:** sin `VITE_WC_PROJECT_ID` se usa un modal propio con el mismo estilo (`src/components/WalletModal.tsx`): recomendadas, búsqueda en "Todas las wallets" y detección de extensiones instaladas (EIP-6963). Los íconos están en `public/wallets/` (de RainbowKit, licencia MIT).

Para cambiar las wallets destacadas, copia el ID desde [Reown Cloud](https://cloud.reown.com) → *Wallets List* (clic en la wallet) o desde [WalletGuide](https://walletguide.walletconnect.network) y agrégalo a `WALLET_IDS`.

Estructura de `src/wallet/`:

~~~
config.ts                 Redes, wallets, tema y metadatos
appkit.ts                 createAppKit (se inicializa una sola vez)
AppKitWalletProvider.tsx  WalletConnect real (wagmi + react-query)
MockWalletProvider.tsx    Modal simulado si no hay VITE_WC_PROJECT_ID
WalletProvider.tsx        Elige real o simulado
context.ts                Hook useWallet() que usa el resto de la app
~~~

Para iniciar sesión solo con wallet en producción, pide al usuario que firme un mensaje (SIWE) y verifícalo en el backend antes de emitir el token.

## Responsive

Por debajo de 900 px la barra lateral se oculta, aparece la barra inferior de pestañas, las tablas pasan a tarjetas y el modal de wallet se abre desde abajo.
