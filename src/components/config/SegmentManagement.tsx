
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomerSegments } from "@/services/pipeline";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export const SegmentManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSegment, setNewSegment] = useState({ name: '', description: '' });
  const [editingSegment, setEditingSegment] = useState({ name: '', description: '' });

  const queryClient = useQueryClient();

  const { data: segments = [], isLoading } = useQuery({
    queryKey: ['customer-segments-management'],
    queryFn: getCustomerSegments
  });

  const createSegmentMutation = useMutation({
    mutationFn: async (segmentData: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('customer_segments')
        .insert({
          name: segmentData.name,
          description: segmentData.description,
          active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments-management'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      setNewSegment({ name: '', description: '' });
      setIsCreating(false);
      toast({
        title: "Segmento criado",
        description: "O segmento foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar segmento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateSegmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description: string } }) => {
      const { error } = await supabase
        .from('customer_segments')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments-management'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      setEditingId(null);
      toast({
        title: "Segmento atualizado",
        description: "O segmento foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar segmento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteSegmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customer_segments')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments-management'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast({
        title: "Segmento desativado",
        description: "O segmento foi desativado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao desativar segmento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreate = () => {
    if (newSegment.name.trim()) {
      createSegmentMutation.mutate(newSegment);
    }
  };

  const handleEdit = (segment: CustomerSegment) => {
    setEditingId(segment.id);
    setEditingSegment({ name: segment.name, description: segment.description || '' });
  };

  const handleUpdate = () => {
    if (editingId && editingSegment.name.trim()) {
      updateSegmentMutation.mutate({
        id: editingId,
        data: editingSegment
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja desativar este segmento?')) {
      deleteSegmentMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando segmentos...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciamento de Segmentos</CardTitle>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Segmento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCreating && (
            <Card className="p-4 border-dashed">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-segment-name">Nome do Segmento</Label>
                  <Input
                    id="new-segment-name"
                    value={newSegment.name}
                    onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do segmento"
                  />
                </div>
                <div>
                  <Label htmlFor="new-segment-description">Descrição</Label>
                  <Textarea
                    id="new-segment-description"
                    value={newSegment.description}
                    onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do segmento"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreate}
                    disabled={createSegmentMutation.isPending || !newSegment.name.trim()}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewSegment({ name: '', description: '' });
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map((segment: CustomerSegment) => (
              <Card key={segment.id} className="p-4">
                {editingId === segment.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editingSegment.name}
                      onChange={(e) => setEditingSegment(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do segmento"
                    />
                    <Textarea
                      value={editingSegment.description}
                      onChange={(e) => setEditingSegment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição do segmento"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdate}
                        disabled={updateSegmentMutation.isPending || !editingSegment.name.trim()}
                      >
                        <Save className="mr-1 h-3 w-3" />
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{segment.name}</h4>
                      <Badge variant={segment.active ? "default" : "secondary"}>
                        {segment.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    {segment.description && (
                      <p className="text-sm text-muted-foreground">{segment.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(segment)}
                      >
                        <Edit2 className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(segment.id)}
                        disabled={!segment.active}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Desativar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
