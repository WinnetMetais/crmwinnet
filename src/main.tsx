
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force white background on document
document.documentElement.style.backgroundColor = 'white';
document.body.style.backgroundColor = 'white';

createRoot(document.getElementById("root")!).render(<App />);
