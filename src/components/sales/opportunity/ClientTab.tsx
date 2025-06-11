
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, MapPin, Phone, Mail, Tag } from "lucide-react";
import { Customer } from "@/services/customers";
import { useQuery } from "@tanstack/react-query";
import { getCustomerSegments } from "@/services/pipeline";

interface ClientTabProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: () => void;
  onNewCustomer: () => void;
}

export const ClientTab = ({ selectedCustomer, onSelectCustomer, onNewCustomer }: ClientTabProps) => {
  const { data: segments = [] } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: getCustomerSegments
  });

  const getSegmentName = (segmentId: string) => {
    const segment = segments.find((s: any) => s.id === segmentId);
    return segment?.name || 'Não definido';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dados do Cliente</h3>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSelectCustomer}>
            Selecionar Cliente
          </Button>
          <Button type="button" variant="default" onClick={onNewCustomer}>
            Novo Cliente
          </Button>
        </div>
      </div>

      {selectedCustomer ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-lg">{selectedCustomer.name}</span>
                  </div>
                  {selectedCustomer.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="text-muted-foreground">{selectedCustomer.company}</span>
                    </div>
                  )}
                </div>
                <Badge variant="default">Cliente Selecionado</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCustomer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.phone}</span>
                  </div>
                )}
                {(selectedCustomer.city || selectedCustomer.state) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedCustomer.city && selectedCustomer.state
                        ? `${selectedCustomer.city}, ${selectedCustomer.state}`
                        : selectedCustomer.city || selectedCustomer.state}
                    </span>
                  </div>
                )}
                {selectedCustomer.segment_id && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">
                      {getSegmentName(selectedCustomer.segment_id)}
                    </Badge>
                  </div>
                )}
              </div>

              {selectedCustomer.cnpj && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>CNPJ:</strong> {selectedCustomer.cnpj}
                  </p>
                </div>
              )}

              {selectedCustomer.contact_person && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Pessoa de Contato:</strong> {selectedCustomer.contact_person}
                  </p>
                </div>
              )}

              {selectedCustomer.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Observações:</strong> {selectedCustomer.notes}
                  </p>
                </div>
              )}
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
            Clique em "Selecionar Cliente" para escolher ou "Novo Cliente" para cadastrar um cliente
          </p>
        </div>
      )}
    </div>
  );
};
