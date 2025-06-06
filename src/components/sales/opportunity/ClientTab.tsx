
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2 } from "lucide-react";
import { Customer } from "@/services/customers";

interface ClientTabProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: () => void;
}

export const ClientTab = ({ selectedCustomer, onSelectCustomer }: ClientTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dados do Cliente</h3>
        <Button type="button" variant="outline" onClick={onSelectCustomer}>
          Selecionar Cliente
        </Button>
      </div>

      {selectedCustomer ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedCustomer.name}</span>
                </div>
                {selectedCustomer.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedCustomer.company}</span>
                  </div>
                )}
                {selectedCustomer.email && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.email}
                  </p>
                )}
                {selectedCustomer.phone && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.phone}
                  </p>
                )}
              </div>
              <Badge variant="default">Cliente Selecionado</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum cliente selecionado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Clique em "Selecionar Cliente" para escolher ou cadastrar um cliente
          </p>
        </div>
      )}
    </div>
  );
};
