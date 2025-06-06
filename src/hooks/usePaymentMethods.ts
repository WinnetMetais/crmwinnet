
import { useQuery } from '@tanstack/react-query';
import { paymentMethodService } from '@/services/paymentMethods';

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: paymentMethodService.getActivePaymentMethods,
  });
};
