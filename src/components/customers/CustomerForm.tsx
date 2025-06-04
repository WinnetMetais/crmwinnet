
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
    zipCode: '',
    customerType: 'pessoa_juridica',
    segment: 'metalurgia',
    priority: 'media',
    leadSource: '',
    website: '',
    socialReason: '',
    status: 'prospecto',
    notes: '',
    contactPerson: '',
    contactRole: '',
    whatsapp: '',
    creditLimit: 0,
    paymentTerms: '',
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

  const handleChange = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === 'create' ? 'Cadastro de Cliente' : 'Editar Cliente'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                <TabsTrigger value="contact">Contato</TabsTrigger>
                <TabsTrigger value="commercial">Comercial</TabsTrigger>
                <TabsTrigger value="additional">Adicional</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                {/* Tipo de Cliente */}
                <div className="space-y-3">
                  <Label>Tipo de Cliente *</Label>
                  <RadioGroup
                    value={formData.customerType}
                    onValueChange={(value: 'pessoa_fisica' | 'pessoa_juridica') => handleChange('customerType', value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pessoa_fisica" id="pf" />
                      <Label htmlFor="pf">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pessoa_juridica" id="pj" />
                      <Label htmlFor="pj">Pessoa Jurídica</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome/Razão Social *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Nome completo ou razão social"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Nome Fantasia</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Nome fantasia da empresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">{formData.customerType === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      placeholder={formData.customerType === 'pessoa_fisica' ? 'XXX.XXX.XXX-XX' : 'XX.XXX.XXX/XXXX-XX'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segment">Segmento *</Label>
                    <Select value={formData.segment} onValueChange={(value) => handleChange('segment', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metalurgia">Metalurgia</SelectItem>
                        <SelectItem value="construcao">Construção</SelectItem>
                        <SelectItem value="industria">Indústria</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Rua, Avenida, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Nome da cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleChange('zipCode', e.target.value)}
                        placeholder="XXXXX-XXX"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6 mt-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Informações de Contato
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="email@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Pessoa de Contato</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange('contactPerson', e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactRole">Cargo</Label>
                    <Input
                      id="contactRole"
                      value={formData.contactRole}
                      onChange={(e) => handleChange('contactRole', e.target.value)}
                      placeholder="Cargo do responsável"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commercial" className="space-y-6 mt-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Informações Comerciais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospecto">Prospecto</SelectItem>
                        <SelectItem value="qualificado">Qualificado</SelectItem>
                        <SelectItem value="negociacao">Em Negociação</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadSource">Origem do Lead</Label>
                    <Select value={formData.leadSource} onValueChange={(value) => handleChange('leadSource', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Como nos conheceu?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site">Site</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="indicacao">Indicação</SelectItem>
                        <SelectItem value="mercado-livre">Mercado Livre</SelectItem>
                        <SelectItem value="feiras">Feiras e Eventos</SelectItem>
                        <SelectItem value="visita-externa">Visita Externa</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">Limite de Crédito</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.creditLimit}
                      onChange={(e) => handleChange('creditLimit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                    <Select value={formData.paymentTerms} onValueChange={(value) => handleChange('paymentTerms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Condições de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a-vista">À Vista</SelectItem>
                        <SelectItem value="30-dias">30 dias</SelectItem>
                        <SelectItem value="60-dias">60 dias</SelectItem>
                        <SelectItem value="30-60-dias">30/60 dias</SelectItem>
                        <SelectItem value="30-60-90-dias">30/60/90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 mt-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informações Adicionais
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Informações adicionais sobre o cliente, preferências, histórico, etc..."
                    rows={5}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-8 pt-6 border-t">
              <Button type="submit" className="flex-1">
                <User className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Cadastrar Cliente' : 'Atualizar Cliente'}
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
