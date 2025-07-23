import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const GlobalKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K para busca global (pode ser implementado depois)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        toast.info('Busca global - Em breve!');
        return;
      }

      // Atalhos com Alt + tecla
      if (event.altKey) {
        event.preventDefault();
        
        switch (event.key) {
          case 'd':
            navigate('/dashboard');
            toast.info('Navegando para Dashboard');
            break;
          case 'c':
            navigate('/customers');
            toast.info('Navegando para Clientes');
            break;
          case 's':
            navigate('/sales');
            toast.info('Navegando para Vendas');
            break;
          case 'f':
            navigate('/financial');
            toast.info('Navegando para Financeiro');
            break;
          case 'r':
            navigate('/reports');
            toast.info('Navegando para Relatórios');
            break;
          case 'a':
            navigate('/analysis');
            toast.info('Navegando para Análises');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);

  return null; // Componente invisível que apenas escuta eventos
};