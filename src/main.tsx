import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import { App } from './ui/App'

const root = document.getElementById('root')
if (root) createRoot(root).render(<App />)
