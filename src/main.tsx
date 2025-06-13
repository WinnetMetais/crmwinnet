
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// FORÇA FUNDO BRANCO EM TODO O DOCUMENTO
document.documentElement.style.setProperty('background', 'white', 'important');
document.documentElement.style.setProperty('background-color', 'white', 'important');
document.body.style.setProperty('background', 'white', 'important');
document.body.style.setProperty('background-color', 'white', 'important');

// Adiciona classes de CSS para garantir fundo branco
document.documentElement.classList.add('bg-white');
document.body.classList.add('bg-white');

createRoot(document.getElementById("root")!).render(<App />);
