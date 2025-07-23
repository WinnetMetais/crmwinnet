
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Validação do elemento root
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado');
}

createRoot(rootElement).render(<App />);
