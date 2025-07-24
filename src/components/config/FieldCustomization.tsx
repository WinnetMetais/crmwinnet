
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  Trash2,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  FileText
} from "lucide-react";
import { useCustomFieldsByModule, useUpdateCustomField, useDeleteCustomField, useCreateCustomField } from '@/hooks/useCustomFields';
import { CustomFieldForm } from './CustomFieldForm';

export const FieldCustomization = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<Record<string, any> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: customerFields = [], isLoading: loadingCustomers } = useCustomFieldsByModule('customers');
  const { data: productFields = [], isLoading: loadingProducts } = useCustomFieldsByModule('products');
  const { data: quoteFields = [], isLoading: loadingQuotes } = useCustomFieldsByModule('quotes');

  const createMutation = useCreateCustomField();
  const updateMutation = useUpdateCustomField();
  const deleteMutation = useDeleteCustomField();

  const fieldTypes = [
    { value: "text", label: "Texto", icon: Type },
    { value: "number", label: "Número", icon: Hash },
    { value: "date", label: "Data", icon: Calendar },
    { value: "select", label: "Lista", icon: List },
    { value: "boolean", label: "Sim/Não", icon: ToggleLeft },
    { value: "textarea", label: "Texto Longo", icon: FileText },
  ];

  const getCurrentFields = () => {
    switch (activeTab) {
      case 'customers':
        return customerFields;
      case 'products':
        return productFields;
      case 'quotes':
        return quoteFields;
      default:
        return [];
    }
  };

  const isLoading = () => {
    switch (activeTab) {
      case 'customers':
        return loadingCustomers;
      case 'products':
        return loadingProducts;
      case 'quotes':
        return loadingQuotes;
      default:
        return false;
    }
  };

  const handleToggleVisibility = (fieldId: string, visible: boolean) => {
    updateMutation.mutate({ id: fieldId, updates: { visible } });
  };

  const handleToggleRequired = (fieldId: string, required: boolean) => {
    updateMutation.mutate({ id: fieldId, updates: { required } });
  };

  const handleCreateField = (data: any) => {
    createMutation.mutate({
      ...data,
      user_id: '00000000-0000-0000-0000-000000000000', // Será substituído pela autenticação real
      field_order: getCurrentFields().length + 1,
    });
  };

  const handleEditField = (data: any) => {
    if (editingField) {
      updateMutation.mutate({ id: editingField.id, updates: data });
      setEditingField(null);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    deleteMutation.mutate(fieldId);
    setDeleteConfirm(null);
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.icon : Type;
  };

  const FieldCard = ({ field }: { field: any }) => {
    const IconComponent = getFieldIcon(field.field_type);
    
    return (
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconComponent className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{field.field_label}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {fieldTypes.find(ft => ft.value === field.field_type)?.label}
                </Badge>
                {field.required && (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    Obrigatório
                  </Badge>
                )}
                {!field.visible && (
                  <Badge variant="secondary" className="text-xs">
                    Oculto
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor={`visible-${field.id}`} className="text-xs">
                Visível
              </Label>
              <Switch
                id={`visible-${field.id}`}
                checked={field.visible}
                onCheckedChange={(checked) => handleToggleVisibility(field.id, checked)}
              />
            </div>
            <div className="flex items-center space-x-1">
              <Label htmlFor={`required-${field.id}`} className="text-xs">
                Obrigatório
              </Label>
              <Switch
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => handleToggleRequired(field.id, checked)}
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setEditingField(field);
                setShowForm(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setDeleteConfirm(field.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {field.options && field.options.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Opções:</p>
            <div className="flex flex-wrap gap-1">
              {field.options.map((option: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campos de Clientes</CardTitle>
                  <CardDescription>
                    Personalize os campos do formulário de clientes
                  </CardDescription>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading() ? (
                <div className="text-center py-8">Carregando campos...</div>
              ) : (
                <div className="space-y-4">
                  {getCurrentFields().map((field) => (
                    <FieldCard key={field.id} field={field} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campos de Produtos</CardTitle>
                  <CardDescription>
                    Personalize os campos do formulário de produtos
                  </CardDescription>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading() ? (
                <div className="text-center py-8">Carregando campos...</div>
              ) : (
                <div className="space-y-4">
                  {getCurrentFields().map((field) => (
                    <FieldCard key={field.id} field={field} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campos de Orçamentos</CardTitle>
                  <CardDescription>
                    Personalize os campos do formulário de orçamentos
                  </CardDescription>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading() ? (
                <div className="text-center py-8">Carregando campos...</div>
              ) : (
                <div className="space-y-4">
                  {getCurrentFields().map((field) => (
                    <FieldCard key={field.id} field={field} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Campo Disponíveis</CardTitle>
          <CardDescription>
            Tipos de campo que podem ser adicionados aos formulários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {fieldTypes.map((type) => (
              <div key={type.value} className="p-3 border rounded-lg text-center">
                <type.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{type.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CustomFieldForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingField(null);
        }}
        onSubmit={editingField ? handleEditField : handleCreateField}
        initialData={editingField}
        module={activeTab}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este campo customizado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteField(deleteConfirm)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
