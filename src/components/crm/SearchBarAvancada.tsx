import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  FileText, 
  Building, 
  Mail, 
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useCRM, Cliente, Orcamento } from '@/contexts/CRMContext';
import { cn } from '@/lib/utils';

interface SearchResult {
  type: 'cliente' | 'orcamento';
  id: string;
  title: string;
  subtitle: string;
  metadata?: string;
  value?: number;
  status?: string;
}

export const SearchBarAvancada: React.FC = () => {
  const { searchTerm, setSearchTerm, buscarClientes, buscarOrcamentos } = useCRM();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (termo: string) => {
    setSearchTerm(termo);
    setSelectedIndex(-1);
    
    if (termo.length > 0) {
      const clientes = buscarClientes(termo);
      const orcamentos = buscarOrcamentos(termo);
      
      const clienteResults: SearchResult[] = clientes.slice(0, 5).map(cliente => ({
        type: 'cliente',
        id: cliente.id,
        title: cliente.name,
        subtitle: cliente.email || cliente.phone || '',
        metadata: cliente.company || cliente.canal,
        status: cliente.fase
      }));

      const orcamentoResults: SearchResult[] = orcamentos.slice(0, 3).map(orcamento => ({
        type: 'orcamento',
        id: orcamento.id,
        title: orcamento.titulo,
        subtitle: orcamento.descricao.substring(0, 50) + '...',
        value: orcamento.valor,
        status: orcamento.status
      }));

      setResults([...clienteResults, ...orcamentoResults]);
      setShowResults(true);
    } else {
      setShowResults(false);
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Navigate to:', result);
    setShowResults(false);
    setSearchTerm('');
    inputRef.current?.blur();
  };

  const getStatusColor = (status: string, type: 'cliente' | 'orcamento') => {
    if (type === 'cliente') {
      switch (status) {
        case 'lead': return 'bg-info/15 text-info';
        case 'contato': return 'bg-warning/15 text-warning';
        case 'proposta': return 'bg-warning/15 text-warning';
        case 'negociacao': return 'bg-primary/15 text-primary';
        case 'fechado': return 'bg-success/15 text-success';
        default: return 'bg-muted text-muted-foreground';
      }
    } else {
      switch (status) {
        case 'rascunho': return 'bg-muted text-muted-foreground';
        case 'enviado': return 'bg-info/15 text-info';
        case 'aprovado': return 'bg-success/15 text-success';
        case 'rejeitado': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const formatStatus = (status: string, type: 'cliente' | 'orcamento') => {
    if (type === 'cliente') {
      switch (status) {
        case 'lead': return 'Lead';
        case 'contato': return 'Contato';
        case 'proposta': return 'Proposta';
        case 'negociacao': return 'Negociação';
        case 'fechado': return 'Fechado';
        default: return status;
      }
    }
    return status;
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Buscar clientes, orçamentos..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length > 0 && setShowResults(true)}
          className="pl-10 pr-4"
        />
      </div>
      
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1"
          >
            <Card className="shadow-lg border">
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    className={cn(
                      "p-3 cursor-pointer transition-colors border-b last:border-b-0",
                      index === selectedIndex 
                        ? "bg-accent" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => handleResultClick(result)}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {result.type === 'cliente' ? (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {result.title}
                          </p>
                          {result.status && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs px-2 py-0",
                                getStatusColor(result.status, result.type)
                              )}
                            >
                              {formatStatus(result.status, result.type)}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {result.subtitle}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {result.metadata && (
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              <span>{result.metadata}</span>
                            </div>
                          )}
                          
                          {result.value && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>R$ {result.value.toLocaleString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showResults && results.length === 0 && searchTerm.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1"
        >
          <Card className="shadow-lg border">
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado para "{searchTerm}"
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};