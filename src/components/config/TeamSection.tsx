
import React from 'react';
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Copy, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface TeamSectionProps {
  appUrl: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ appUrl }) => {
  const teamForm = useForm({
    defaultValues: {
      role: "editor",
      notifications: true,
    }
  });

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`${appUrl}/invite/abc123`);
    toast.success("Link de convite copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">Convidar Membros</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Convide novos membros para acessar o dashboard
          </p>
          <div className="flex gap-2 mt-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyInviteLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
            <Button size="sm">
              <ArrowRight className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
        
        <Form {...teamForm}>
          <form className="border rounded-lg p-4 space-y-4">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-medium">Configurações de Convite</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste as permissões para novos membros
              </p>
            </div>
            <div className="space-y-4">
              <FormField
                control={teamForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função padrão</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define as permissões iniciais
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={teamForm.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Notificações</FormLabel>
                      <FormDescription>
                        Enviar notificações de convite
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <h3 className="font-medium">Membros da Equipe</h3>
        </div>
        <div className="border-t">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">AM</span>
              </div>
              <div>
                <p className="text-sm font-medium">Ana Marques</p>
                <p className="text-xs text-muted-foreground">ana@winnetmetais.com.br</p>
              </div>
            </div>
            <Badge>Administrador</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">JC</span>
              </div>
              <div>
                <p className="text-sm font-medium">João Costa</p>
                <p className="text-xs text-muted-foreground">joao@agencia4k.com.br</p>
              </div>
            </div>
            <Badge variant="outline">Editor</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
