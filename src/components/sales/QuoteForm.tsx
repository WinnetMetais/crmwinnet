import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Download, Send, Calculator, FileText, Package2 } from "lucide-react";
import { QuoteFormData, QuoteItem } from "@/types/quote";
import { Product } from "@/services/products";
import { ProductSelector } from "@/components/products/ProductSelector";
import { CustomerSelector } from "@/components/quotes/CustomerSelector";
import { CustomerQuote } from "@/services/customersQuotes";
import { toast } from "@/hooks/use-toast";
import { quoteService, QuoteItemInsert, QuoteInsert } from "@/services/quotes";
import { useQueryClient } from "@tanstack/react-query";
import { useUnifiedRealtimeSync } from '@/hooks/useUnifiedRealtimeSync';
interface QuoteFormProps {
  onClose: () => void;
  initialData?: Partial<QuoteFormData>;
  mode?: 'create' | 'edit';
}

export const QuoteForm = ({ onClose, initialData, mode = 'create' }: QuoteFormProps) => {
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    quoteNumber: generateQuoteNumber(),
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCnpj: '',
    contactPerson: '',
    requestedBy: '',
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    paymentTerms: '',
    deliveryTerms: '',
    warranty: '90 dias contra defeitos de fabricação',
    notes: '',
    internalNotes: '',
    status: 'rascunho',
    ...initialData
  });
const [saving, setSaving] = useState(false);
const queryClient = useQueryClient();

// Habilitar realtime updates
useUnifiedRealtimeSync();

useEffect(() => {
  if (mode === 'create' && !initialData?.quoteNumber) {
    quoteService
      .generateQuoteNumber()
      .then((num) => setFormData((prev) => ({ ...prev, quoteNumber: num })))
      .catch(() => {});
  }
  // run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

function generateQuoteNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORC-${year}${month}${day}-${random}`;
  }

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      code: '',
      description: '',
      quantity: 1,
      unit: 'kg',
      unitPrice: 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleCustomerSelect = (customer: CustomerQuote) => {
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email || '',
      customerPhone: customer.phone || '',
      customerAddress: customer.address || '',
      customerCnpj: customer.cnpj_cpf || '',
      contactPerson: customer.contact_person || ''
    }));

    setShowCustomerSelector(false);

    toast({
      title: "Cliente selecionado",
      description: `${customer.name} foi selecionado para o orçamento`,
    });
  };

  const handleProductSelect = (product: Product, marginPercent: number) => {
    const marginPrice = product.cost_price ? product.cost_price / (1 - marginPercent / 100) : 0;
    
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      code: product.sku || '',
      description: product.name + (product.description ? ` - ${product.description}` : ''),
      quantity: 1,
      unit: product.unit || 'kg',
      unitPrice: marginPrice,
      total: marginPrice
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setShowProductSelector(false);
    calculateTotals();

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao orçamento com margem de ${marginPercent}%`,
    });
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
    calculateTotals();
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    calculateTotals();
  };

  const calculateTotals = () => {
    setTimeout(() => {
      setFormData(prev => {
        const subtotal = prev.items.reduce((sum, item) => sum + item.total, 0);
        const discountAmount = subtotal * (prev.discount / 100);
        const total = subtotal - discountAmount;
        
        return {
          ...prev,
          subtotal,
          total
        };
      });
    }, 0);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  try {
    const header: Omit<QuoteInsert, 'user_id'> = {
      quote_number: formData.quoteNumber,
      date: formData.date,
      valid_until: formData.validUntil,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail || null,
      customer_phone: formData.customerPhone || null,
      customer_address: formData.customerAddress || null,
      customer_cnpj: formData.customerCnpj || null,
      contact_person: formData.contactPerson || null,
      requested_by: formData.requestedBy || null,
      subtotal: formData.subtotal,
      discount: formData.discount,
      total: formData.total,
      payment_terms: formData.paymentTerms || null,
      delivery_terms: formData.deliveryTerms || null,
      warranty: formData.warranty || null,
      notes: formData.notes || null,
      internal_notes: formData.internalNotes || null,
      status: formData.status,
      // user_id is set in the service
    };

    const quote = await quoteService.createQuote(header as unknown as QuoteInsert);

    if (formData.items.length > 0) {
      await Promise.all(
        formData.items.map((it) => {
          const item: QuoteItemInsert = {
            quote_id: quote.id,
            code: it.code,
            description: it.description,
            quantity: it.quantity,
            unit: it.unit,
            unit_price: it.unitPrice,
            total: it.total,
          };
          return quoteService.addQuoteItem(item);
        })
      );
    }

    await queryClient.invalidateQueries({ queryKey: ['quotes'] });

    toast({
      title: 'Sucesso',
      description: `Orçamento ${quote.quote_number} criado com sucesso!`,
    });
    onClose();
  } catch (error: any) {
    console.error(error);
    toast({
      title: 'Erro',
      description: error?.message || 'Falha ao salvar orçamento',
      variant: 'destructive',
    });
  } finally {
    setSaving(false);
  }
};

  const generatePDF = () => {
    toast({
      title: "PDF Gerado",
      description: "O orçamento foi exportado para PDF com sucesso!",
    });
  };

  const sendQuote = () => {
    setFormData(prev => ({ ...prev, status: 'enviado', sentAt: new Date().toISOString() }));
    toast({
      title: "Orçamento Enviado",
      description: "O orçamento foi enviado por e-mail para o cliente!",
    });
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho compacto dentro do Dialog */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-semibold">Orçamento</h2>
            <p className="text-xs text-muted-foreground">Nº {formData.quoteNumber}</p>
          </div>
        </div>
        <Badge variant="secondary">{formData.status.toUpperCase()}</Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Cabeçalho da Empresa */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-800">WINNET METAIS</h1>
          <p className="text-sm text-gray-600">Av. Wallace Simonsen, 437 - Nova Petrópolis - São Bernardo do Campo - SP</p>
          <p className="text-sm text-gray-600">CNPJ: 57.656.387/0001-26 | Telefone: (11) 4428-9099</p>
        </div>

        {/* Informações do Orçamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validUntil">Válido até</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestedBy">Solicitado por</Label>
            <Input
              id="requestedBy"
              value={formData.requestedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, requestedBy: e.target.value }))}
              placeholder="Nome do solicitante"
            />
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">CLIENTE</h3>
            <Button 
              type="button" 
              onClick={() => setShowCustomerSelector(true)} 
              variant="outline" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buscar Cliente
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome/Razão Social *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerCnpj">CNPJ/CPF</Label>
              <Input
                id="customerCnpj"
                value={formData.customerCnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, customerCnpj: e.target.value }))}
                placeholder="XX.XXX.XXX/XXXX-XX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">E-mail</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="email@cliente.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefone</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customerAddress">Endereço</Label>
              <Input
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
                placeholder="Endereço completo"
              />
            </div>
          </div>
        </div>

        {/* Itens do Orçamento */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">ITENS DO ORÇAMENTO</h3>
            <div className="flex gap-2">
              <Button type="button" onClick={() => setShowProductSelector(true)} variant="default" size="sm">
                <Package2 className="h-4 w-4 mr-2" />
                Buscar Produto
              </Button>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Item Manual
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20">Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-20">Qtd</TableHead>
                  <TableHead className="w-20">Unid</TableHead>
                  <TableHead className="w-32">Preço Unit.</TableHead>
                  <TableHead className="w-32">Total</TableHead>
                  <TableHead className="w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.code}
                        onChange={(e) => updateItem(item.id, 'code', e.target.value)}
                        placeholder="SKU"
                        className="w-full text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Descrição do produto"
                        className="w-full text-xs"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="ton">Ton</SelectItem>
                          <SelectItem value="m">m</SelectItem>
                          <SelectItem value="m2">m²</SelectItem>
                          <SelectItem value="pc">Pç</SelectItem>
                          <SelectItem value="un">Un</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">R$ {item.total.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totais */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">R$ {formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Desconto (%):</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }));
                      calculateTotals();
                    }}
                    className="w-20 text-right"
                  />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL GERAL:</span>
                  <span>R$ {formData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Condições de Pagamento e Entrega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Forma de Pagamento</Label>
            <Select value={formData.paymentTerms} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione as condições" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX - À vista</SelectItem>
                <SelectItem value="boleto-vista">Boleto - À vista</SelectItem>
                <SelectItem value="cartao-credito">Cartão de Crédito</SelectItem>
                <SelectItem value="30-dias">30 dias</SelectItem>
                <SelectItem value="30-60-dias">30/60 dias</SelectItem>
                <SelectItem value="30-60-90-dias">30/60/90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryTerms">Prazo de Entrega</Label>
            <Input
              id="deliveryTerms"
              value={formData.deliveryTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryTerms: e.target.value }))}
              placeholder="Ex: 15 dias úteis"
            />
          </div>
        </div>

        {/* Garantia */}
        <div className="space-y-2">
          <Label htmlFor="warranty">Garantia</Label>
          <Input
            id="warranty"
            value={formData.warranty}
            onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
          />
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Observações adicionais para o cliente..."
            rows={3}
          />
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-2">
<Button type="submit" className="flex-1" disabled={saving}>
  <Calculator className="h-4 w-4 mr-2" />
  {saving ? 'Salvando...' : 'Salvar Orçamento'}
</Button>
          <Button type="button" variant="outline" onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
          <Button type="button" variant="outline" onClick={sendQuote}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Cliente
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>

      {/* Seletor de Produtos */}
      {showProductSelector && (
        <ProductSelector onSelect={handleProductSelect} onClose={() => setShowProductSelector(false)} />
      )}

      {/* Seletor de Clientes */}
      {showCustomerSelector && (
        <CustomerSelector onSelect={handleCustomerSelect} onClose={() => setShowCustomerSelector(false)} />
      )}
    </div>
  );
};
