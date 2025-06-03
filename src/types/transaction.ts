
export interface TransactionFormData {
  type: 'receita' | 'despesa';
  title: string;
  amount: number;
  category: string;
  subcategory: string;
  channel: string;
  date: string;
  dueDate: string;
  paymentMethod: string;
  status: 'pendente' | 'pago' | 'vencido';
  recurring: boolean;
  recurringPeriod: string;
  description: string;
  tags: string[];
  clientName: string;
  invoiceNumber: string;
}
