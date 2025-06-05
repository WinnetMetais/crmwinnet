
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, User } from "lucide-react";
import { Customer, getCustomers } from "@/services/customers";
import { useQuery } from "@tanstack/react-query";

interface CustomerSelectorProps {
  onSelectCustomer: (customer: Customer) => void;
  onNewCustomer: () => void;
  onClose: () => void;
  selectedCustomer?: Customer | null;
}

export const CustomerSelector = ({ onSelectCustomer, onNewCustomer, onClose, selectedCustomer }: CustomerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers
  });

  const filteredCustomers = customers.filter((customer: Customer) => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <h2 className="text-xl font-bold">Selecionar Cliente</h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
              ✕
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar Cliente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Digite o nome, empresa ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={onNewCustomer}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-8">
                <p>Buscando clientes...</p>
              </div>
            )}

            {!isLoading && filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="mx-auto h-12 w-12 mb-4" />
                <p>Nenhum cliente encontrado</p>
              </div>
            )}

            {filteredCustomers.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow 
                        key={customer.id}
                        className={selectedCustomer?.id === customer.id ? "bg-blue-50" : ""}
                      >
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.company || '-'}</TableCell>
                        <TableCell>{customer.email || '-'}</TableCell>
                        <TableCell>{customer.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status === "active" ? "Ativo" : customer.status || "Ativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => onSelectCustomer(customer)}
                            variant={selectedCustomer?.id === customer.id ? "default" : "outline"}
                          >
                            {selectedCustomer?.id === customer.id ? "Selecionado" : "Selecionar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
