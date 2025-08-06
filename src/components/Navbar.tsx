
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Settings, Moon, Sun, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

  // Monitor scroll position to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="font-bold text-xl">
            <Link to="/" className="flex items-center">
              <span className="text-gradient font-extrabold">Winnet</span>
              <span className="ml-1">Metais</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link 
              to="/dashboard" 
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-secondary",
                isActive('/dashboard') ? "bg-secondary text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link 
              to="/content" 
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-secondary",
                isActive('/content') ? "bg-secondary text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              Conteúdo
            </Link>
            <Link 
              to="/sales" 
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-secondary",
                isActive('/sales') ? "bg-secondary text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              Vendas
            </Link>
            <Link 
              to="/campaigns" 
              className={cn(
                "px-3 py-2 rounded-md transition-colors hover:bg-secondary",
                isActive('/campaigns') ? "bg-secondary text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              Campanhas
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-9 w-full bg-secondary/50 border-none focus-visible:ring-primary/20"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full" aria-label="User menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>WM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.email || 'Usuário'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/users" className="flex">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/config" className="flex">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
