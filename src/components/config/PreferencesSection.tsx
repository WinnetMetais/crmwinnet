
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const PreferencesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Configurações de Exibição</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div>
              <p className="font-medium">Gráficos Interativos</p>
              <p className="text-sm text-muted-foreground">Habilitar animações em gráficos</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div>
              <p className="font-medium">Modo Compacto</p>
              <p className="text-sm text-muted-foreground">Reduzir espaçamento entre elementos</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div>
              <p className="font-medium">Notificações</p>
              <p className="text-sm text-muted-foreground">Receber alertas de desempenho</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div>
              <p className="font-medium">Métricas em Tempo Real</p>
              <p className="text-sm text-muted-foreground">Atualizar dados a cada 5 minutos</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Relatórios Automáticos</h3>
        <div className="rounded-lg border p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Envio de Relatórios</p>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Frequência</label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Formato</label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-6">
        <Button>Salvar Preferências</Button>
      </div>
    </div>
  );
};

export default PreferencesSection;
