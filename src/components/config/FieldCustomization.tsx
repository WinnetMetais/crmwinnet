import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  FileText
} from "lucide-react";
import { toast } from "sonner";

export const FieldCustomization = () => {
  const [customerFields, setCustomerFields] = useState([
    { id: 1, name: "Segmento", type: "select", required: false, visible: true, options: ["Industrial", "Construção", "Naval"] },
    { id: 2, name: "Origem Lead", type: "select", required: true, visible: true, options: ["Site", "Indicação", "Telefone", "Email"] },
    { id: 3, name: "Potencial Compra", type: "number", required: false, visible: true, options: [] },
    { id: 4, name: "Data Próximo Contato", type: "date", required: false, visible: true, options: [] },
  ]);

  const [productFields, setProductFields] = useState([
    { id: 1, name: "Certificação", type: "text", required: false, visible: true, options: [] },
    { id: 2, name: "Origem", type: "select", required: false, visible: true, options: ["Nacional", "Importado"] },
    { id: 3, name: "Prazo Entrega", type: "number", required: true, visible: true, options: [] },
    { id: 4, name: "Temperatura Trabalho", type: "text", required: false, visible: false, options: [] },
  ]);

  const [quoteFields, setQuoteFields] = useState([
    { id: 1, name: "Prazo Pagamento", type: "select", required: true, visible: true, options: ["À vista", "30 dias", "60 dias", "90 dias"] },
    { id: 2, name: "Condições Especiais", type: "textarea", required: false, visible: true, options: [] },
    { id: 3, name: "Desconto Máximo", type: "number", required: false, visible: true, options: [] },
    { id: 4, name: "Observações Internas", type: "textarea", required: false, visible: false, options: [] },
  ]);

  const fieldTypes = [
    { value: "text", label: "Texto", icon: Type },
    { value: "number", label: "Número", icon: Hash },
    { value: "date", label: "Data", icon: Calendar },
    { value: "select", label: "Lista", icon: List },
    { value: "boolean", label: "Sim/Não", icon: ToggleLeft },
    { value: "textarea", label: "Texto Longo", icon: FileText },
  ];

  const handleToggleVisibility = (module: string, fieldId: number) => {
    const updateFields = (fields: any[]) => 
      fields.map(field => 
        field.id === fieldId 
          ? { ...field, visible: !field.visible }
          : field
      );

    if (module === "customers") {
      setCustomerFields(updateFields(customerFields));
    } else if (module === "products") {
      setProductFields(updateFields(productFields));
    } else if (module === "quotes") {
      setQuoteFields(updateFields(quoteFields));
    }

    toast.success("Visibilidade do campo atualizada!");
  };

  const handleToggleRequired = (module: string, fieldId: number) => {
    const updateFields = (fields: any[]) => 
      fields.map(field => 
        field.id === fieldId 
          ? { ...field, required: !field.required }
          : field
      );

    if (module === "customers") {
      setCustomerFields(updateFields(customerFields));
    } else if (module === "products") {
      setProductFields(updateFields(productFields));
    } else if (module === "quotes") {
      setQuoteFields(updateFields(quoteFields));
    }

    toast.success("Campo obrigatório atualizado!");
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.icon : Type;
  };

  const FieldCard = ({ field, module }: { field: any, module: string }) => {
    const IconComponent = getFieldIcon(field.type);
    
    return (
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconComponent className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{field.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {fieldTypes.find(ft => ft.value === field.type)?.label}
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
                onCheckedChange={() => handleToggleVisibility(module, field.id)}
              />
            </div>
            <div className="flex items-center space-x-1">
              <Label htmlFor={`required-${field.id}`} className="text-xs">
                Obrigatório
              </Label>
              <Switch
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={() => handleToggleRequired(module, field.id)}
              />
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {field.options.length > 0 && (
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
      <Tabs defaultValue="customers" className="w-full">
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerFields.map((field) => (
                  <FieldCard key={field.id} field={field} module="customers" />
                ))}
              </div>
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productFields.map((field) => (
                  <FieldCard key={field.id} field={field} module="products" />
                ))}
              </div>
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quoteFields.map((field) => (
                  <FieldCard key={field.id} field={field} module="quotes" />
                ))}
              </div>
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
    </div>
  );
};
