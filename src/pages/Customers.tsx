import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, Download, Mail, Phone, Building, MapPin, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { Customer, getCustomers, createCustomer, updateCustomer, deleteCustomer, deleteCustomerCascade } from "@/services/customers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUnifiedRealtimeSync } from '@/hooks/useUnifiedRealtimeSync';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [deleteCascade, setDeleteCascade] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: "",
    lead_source: "",
    website: "",
    status: "prospect" as "prospect" | "qualified" | "customer" | "active" | "inactive",
  });

  const queryClient = useQueryClient();
  useUnifiedRealtimeSync(); // Enable real-time updates

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false);
      resetForm();
      toast({
        title: "Cliente criado",
        description: "Cliente cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setEditingCustomer(null);
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente: " + error.message,
        variant: "destructive",
      });
    },
  });

const deleteCustomerMutation = useMutation({
  mutationFn: deleteCustomer,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setDeletingCustomer(null);
    toast({
      title: "Cliente excluído",
      description: "Cliente excluído com sucesso!",
    });
  },
  onError: (error) => {
    toast({
      title: "Erro",
      description: "Erro ao excluir cliente: " + (error as any).message,
      variant: "destructive",
    });
  },
});

const deleteCustomerCascadeMutation = useMutation({
  mutationFn: deleteCustomerCascade,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setDeletingCustomer(null);
    toast({
      title: "Cliente e vínculos excluídos",
      description: "Cliente e oportunidades/negócios vinculados removidos.",
    });
  },
  onError: (error) => {
    toast({
      title: "Erro",
      description: "Erro ao excluir com vínculos: " + (error as any).message,
      variant: "destructive",
    });
  },
});

  const resetForm = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      notes: "",
      lead_source: "",
      website: "",
      status: "prospect",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomerMutation.mutate({ id: editingCustomer.id, data: newCustomer });
    } else {
      createCustomerMutation.mutate(newCustomer);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zip_code: customer.zip_code || '',
      notes: customer.notes || '',
      lead_source: customer.lead_source || '',
      website: customer.website || '',
      // Garantir status válido no formulário de edição
      status: (customer.status === 'lead' ? 'prospect' : (customer.status as any)) || 'prospect',
    });
    setOpen(true);
  };

const handleDelete = (customer: Customer) => {
  setDeleteCascade(true);
  setDeletingCustomer(customer);
};

const confirmDelete = () => {
  if (deletingCustomer) {
    if (deleteCascade) {
      deleteCustomerCascadeMutation.mutate(deletingCustomer.id);
    } else {
      deleteCustomerMutation.mutate(deletingCustomer.id);
    }
  }
};

  const filteredCustomers = customers.filter((customer: Customer) => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <p className="text-muted-foreground">Gerencie seus clientes e leads</p>
              </div>
              
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Dialog open={open} onOpenChange={(open) => {
                  setOpen(open);
                  if (!open) {
                    setEditingCustomer(null);
                    resetForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader>
                        <DialogTitle>{editingCustomer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do cliente. Clique em salvar quando finalizar.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={newCustomer.name} 
                              onChange={handleChange} 
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={newCustomer.email} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              value={newCustomer.phone} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Empresa</Label>
                            <Input 
                              id="company" 
                              name="company" 
                              value={newCustomer.company} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={newCustomer.address} 
                            onChange={handleChange} 
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={newCustomer.city} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input 
                              id="state" 
                              name="state" 
                              value={newCustomer.state} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip_code">CEP</Label>
                            <Input 
                              id="zip_code" 
                              name="zip_code" 
                              value={newCustomer.zip_code} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="lead_source">Origem do Lead</Label>
                            <Input 
                              id="lead_source" 
                              name="lead_source" 
                              value={newCustomer.lead_source} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={newCustomer.status} onValueChange={(v) => setNewCustomer(prev => ({ ...prev, status: v as any }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
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
                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações</Label>
                          <Textarea 
                            id="notes" 
                            name="notes" 
                            value={newCustomer.notes} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending}
                        >
                          {(createCustomerMutation.isPending || updateCustomerMutation.isPending) 
                            ? "Salvando..." 
                            : editingCustomer ? "Atualizar Cliente" : "Salvar Cliente"
                          }
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Pesquisar e Filtrar</CardTitle>
                <CardDescription>Encontre seus clientes e leads rapidamente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar por nome, empresa ou email..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                  <Button variant="outline" className="sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum cliente encontrado. Adicione seu primeiro cliente!
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer: Customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                {customer.email && (
                                  <div className="flex items-center text-sm">
                                    <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span>{customer.email}</span>
                                  </div>
                                )}
                                {customer.phone && (
                                  <div className="flex items-center text-sm">
                                    <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span>{customer.phone}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {customer.company ? (
                                <div className="flex items-center">
                                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{customer.company}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Não informado</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {customer.city ? (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{customer.city}, {customer.state || ""}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Não informado</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.status === "active" ? "bg-green-100 text-green-800" :
                                customer.status === "inactive" ? "bg-gray-100 text-gray-800" :
                                customer.status === "lead" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {customer.status === "active" ? "Ativo" :
                                 customer.status === "inactive" ? "Inativo" :
                                 customer.status === "lead" ? "Lead" : "Ativo"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleEdit(customer)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(customer)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingCustomer} onOpenChange={() => setDeletingCustomer(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
<AlertDialogDescription>
  Tem certeza que deseja excluir o cliente "{deletingCustomer?.name}"?
  Esta ação não pode ser desfeita.
</AlertDialogDescription>
<div className="mt-4 flex items-center gap-3">
  <Switch id="cascade" checked={deleteCascade} onCheckedChange={setDeleteCascade} />
  <Label htmlFor="cascade">Excluir também oportunidades/negócios vinculados</Label>
</div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={confirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Customers;
