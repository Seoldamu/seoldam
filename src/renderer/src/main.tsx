import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import GlobalStyle from './shared/styles/global.css'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <GlobalStyle />
      <App />
    </HashRouter>
  </StrictMode>
)
