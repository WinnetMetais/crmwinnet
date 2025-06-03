
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdditionalInfoSectionProps {
  paymentMethod: string;
  clientName: string;
  onPaymentMethodChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
}

export const AdditionalInfoSection = ({ paymentMethod, clientName, onPaymentMethodChange, onClientNameChange }: AdditionalInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
        <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a forma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="cartao-credito">Cartão de Crédito</SelectItem>
            <SelectItem value="cartao-debito">Cartão de Débito</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="transferencia">Transferência</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientName">Nome do Cliente/Fornecedor</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
          placeholder="Nome da empresa ou pessoa"
        />
      </div>
    </div>
  );
};
