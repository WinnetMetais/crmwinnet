import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { useCRM, Cliente } from '@/contexts/CRMContext';
import { cn } from '@/lib/utils';

const fases = [
  { 
    id: 'lead' as const, 
    titulo: 'Lead', 
    cor: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'contato' as const, 
    titulo: 'Primeiro Contato', 
    cor: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  { 
    id: 'proposta' as const, 
    titulo: 'Proposta Enviada', 
    cor: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  { 
    id: 'negociacao' as const, 
    titulo: 'Em Negociação', 
    cor: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  { 
    id: 'fechado' as const, 
    titulo: 'Fechado', 
    cor: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
];

interface ClienteCardProps {
  cliente: Cliente;
  onMoveToNextStage: (clienteId: string, nextStage: Cliente['fase']) => void;
}

const ClienteCard: React.FC<ClienteCardProps> = ({ cliente, onMoveToNextStage }) => {
  const currentStageIndex = fases.findIndex(fase => fase.id === cliente.fase);
  const nextStage = fases[currentStageIndex + 1];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getChannelColor = (canal: Cliente['canal']) => {
    switch (canal) {
      case 'Google': return 'bg-blue-100 text-blue-800';
      case 'Facebook/Instagram': return 'bg-pink-100 text-pink-800';
      case 'Indicação': return 'bg-green-100 text-green-800';
      case 'Orgânico': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium truncate max-w-[120px]">
                  {cliente.name}
                </CardTitle>
                <div className="flex items-center gap-1 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs px-2 py-0", getChannelColor(cliente.canal))}
                  >
                    {cliente.canal}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2">
          {cliente.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{cliente.email}</span>
            </div>
          )}
          
          {cliente.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{cliente.phone}</span>
            </div>
          )}
          
          {cliente.company && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="w-3 h-3" />
              <span className="truncate">{cliente.company}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Criado em {formatDate(cliente.created_at)}</span>
          </div>

          {cliente.observacoes && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              {cliente.observacoes.substring(0, 60)}
              {cliente.observacoes.length > 60 && '...'}
            </div>
          )}

          {nextStage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 text-xs"
              onClick={() => onMoveToNextStage(cliente.id, nextStage.id)}
            >
              Mover para {nextStage.titulo}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface KanbanColumnProps {
  fase: typeof fases[0];
  clientes: Cliente[];
  onMoveToNextStage: (clienteId: string, nextStage: Cliente['fase']) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ fase, clientes, onMoveToNextStage }) => {
  const clienteCount = clientes.length;
  const totalValue = clientes
    .filter(c => c.deals && c.deals.length > 0)
    .reduce((sum, c) => sum + (c.deals?.[0]?.value || 0), 0);

  return (
    <div className="flex-1 min-w-[280px]">
      <div className={cn(
        "rounded-lg p-4 mb-4 border-2",
        fase.bgColor,
        fase.borderColor
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", fase.cor)} />
            <h3 className="font-medium text-sm">{fase.titulo}</h3>
            <Badge variant="secondary" className="text-xs">
              {clienteCount}
            </Badge>
          </div>
        </div>
        
        {totalValue > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="w-3 h-3" />
            <span>R$ {totalValue.toLocaleString('pt-BR')}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {clientes.map(cliente => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onMoveToNextStage={onMoveToNextStage}
            />
          ))}
        </AnimatePresence>
        
        {clienteCount === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">Nenhum cliente nesta fase</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const { clientes, atualizarFaseCliente } = useCRM();

  const handleMoveToNextStage = (clienteId: string, nextStage: Cliente['fase']) => {
    atualizarFaseCliente(clienteId, nextStage);
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {fases.map(fase => {
          const clientesDaFase = clientes.filter(cliente => cliente.fase === fase.id);
          
          return (
            <KanbanColumn
              key={fase.id}
              fase={fase}
              clientes={clientesDaFase}
              onMoveToNextStage={handleMoveToNextStage}
            />
          );
        })}
      </div>
    </div>
  );
};