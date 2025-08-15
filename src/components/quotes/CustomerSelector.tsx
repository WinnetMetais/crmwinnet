import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, X, Plus, User, Mail, Phone, MapPin, Building } from "lucide-react";
import { useSearchCustomersQuotes, useCreateCustomerQuote } from "@/hooks/useCustomersQuotes";
import { CustomerQuote } from "@/services/customersQuotes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerSelectorProps {
  onSelect: (customer: CustomerQuote) => void;
  onClose: () => void;
}

interface NewCustomerFormData {
  name: string;
  email: string;
  phone: string;
  cnpj_cpf: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  contact_person: string;
}

export const CustomerSelector = ({ onSelect, onClose }: CustomerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomerFormData>({
    name: '',
    email: '',
    phone: '',
    cnpj_cpf: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    contact_person: ''
  });

  const { data: customers = [], isLoading } = useSearchCustomersQuotes(searchTerm);
  const createCustomer = useCreateCustomerQuote();

  const handleCustomerSelect = (customer: CustomerQuote) => {
    onSelect(customer);
    onClose();
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createCustomer.mutateAsync(newCustomer);
      onSelect(created);
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Buscar Cliente
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCustomer} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome/Razão Social *</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
                        <Input
                          id="cnpj_cpf"
                          value={newCustomer.cnpj_cpf}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, cnpj_cpf: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_person">Pessoa de Contato</Label>
                        <Input
                          id="contact_person"
                          value={newCustomer.contact_person}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, contact_person: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip_code">CEP</Label>
                        <Input
                          id="zip_code"
                          value={newCustomer.zip_code}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, zip_code: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={newCustomer.city}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={newCustomer.state}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Textarea
                          id="address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createCustomer.isPending}>
                        {createCustomer.isPending ? 'Criando...' : 'Criar Cliente'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Digite nome, email ou CNPJ/CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-96">
              {searchTerm.length < 2 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Digite pelo menos 2 caracteres para buscar</p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">Buscando clientes...</div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Nenhum cliente encontrado</p>
                  <p className="text-sm">Tente outro termo ou cadastre um novo cliente</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <Card 
                      key={customer.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors border border-border"
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-medium">{customer.name}</h3>
                              {customer.cnpj_cpf && (
                                <Badge variant="outline" className="text-xs">
                                  {customer.cnpj_cpf}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              {customer.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{customer.email}</span>
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{customer.phone}</span>
                                </div>
                              )}
                              {customer.contact_person && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{customer.contact_person}</span>
                                </div>
                              )}
                              {(customer.city && customer.state) && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{customer.city}, {customer.state}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};