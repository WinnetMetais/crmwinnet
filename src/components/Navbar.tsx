
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 font-bold text-xl">
          <Link to="/">Winnet Metais</Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link 
            to="/dashboard" 
            className={cn(
              "transition-colors hover:text-primary",
              isActive('/dashboard') ? "text-primary" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link 
            to="/config" 
            className={cn(
              "transition-colors hover:text-primary",
              isActive('/config') ? "text-primary" : "text-muted-foreground"
            )}
          >
            Configurações
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
