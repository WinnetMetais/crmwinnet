
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCustomerInteractions,
  createCustomerInteraction,
  CustomerInteraction
} from "@/services/opportunities";

export const useCustomerInteractions = (customerId?: string) => {
  return useQuery({
    queryKey: ['customer-interactions', customerId],
    queryFn: () => getCustomerInteractions(customerId),
  });
};

export const useCreateCustomerInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerInteraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-interactions'] });
    }
  });
};
