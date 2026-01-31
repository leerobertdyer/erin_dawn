// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './firebase/firebaseConfig'
import { init_GA } from './util/analytics'

init_GA()

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  /* </StrictMode>, */
)
