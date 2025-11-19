
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Building2, Phone, Mail, MapPin, DollarSign, User, FileText } from "lucide-react";
import { CustomerFormData } from "@/types/customer";
import { toast } from "@/hooks/use-toast";

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CustomerFormData>;
  mode?: 'create' | 'edit';
}

export const CustomerForm = ({ onSubmit, onCancel, initialData, mode = 'create' }: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    cnpj: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    lead_source: '',
    website: '',
    social_reason: '',
    status: 'prospect',
    notes: '',
    contact_person: '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast({
      title: mode === 'create' ? "Cliente Cadastrado" : "Cliente Atualizado",
      description: `${formData.name} foi ${mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!`,
    });
  };

  const handleChange = <K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === 'create' ? 'Cadastro de Cliente' : 'Editar Cliente'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Preencha as informações do cliente. Clique em salvar quando finalizar.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primeira linha - Nome e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="label-readable">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                  className="input-readable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="label-readable">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Digite o email"
                  className="input-readable"
                />
              </div>
            </div>

            {/* Segunda linha - Telefone e Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="label-readable">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Digite o telefone"
                  className="input-readable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="label-readable">Empresa</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Digite o nome da empresa"
                  className="input-readable"
                />
              </div>
            </div>

            {/* Terceira linha - Endereço completo */}
            <div className="space-y-2">
              <Label htmlFor="address" className="label-readable">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Digite o endereço completo"
                className="input-readable"
              />
            </div>

            {/* Quarta linha - Cidade, Estado e CEP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="label-readable">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Digite a cidade"
                  className="input-readable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="label-readable">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="UF"
                  maxLength={2}
                  className="input-readable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip_code" className="label-readable">CEP</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  placeholder="00000-000"
                  className="input-readable"
                />
              </div>
            </div>

            {/* Campos adicionais em collapse */}
            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-sm text-readable">
                Informações Adicionais (Clique para expandir)
              </summary>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="label-readable">CNPJ/CPF</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      placeholder="XX.XXX.XXX/XXXX-XX"
                      className="input-readable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="label-readable">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.empresa.com"
                      className="input-readable"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person" className="label-readable">Pessoa de Contato</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => handleChange('contact_person', e.target.value)}
                      placeholder="Nome do responsável"
                      className="input-readable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead_source" className="label-readable">Origem do Lead</Label>
                    <Input
                      id="lead_source"
                      value={formData.lead_source}
                      onChange={(e) => handleChange('lead_source', e.target.value)}
                      placeholder="Como nos conheceu?"
                      className="input-readable"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="label-readable">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'prospect' | 'qualified' | 'customer') => handleChange('status', value)}>
                    <SelectTrigger className="input-readable">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospecto</SelectItem>
                      <SelectItem value="qualified">Qualificado</SelectItem>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </details>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Informações adicionais sobre o cliente..."
                rows={4}
                className="border-warning focus:border-warning"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button type="submit" className="flex-1">
                <User className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Salvar Cliente' : 'Atualizar Cliente'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
