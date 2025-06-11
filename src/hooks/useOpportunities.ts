
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  Opportunity
} from "@/services/opportunities";

export const useOpportunities = () => {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: getOpportunities,
  });
};

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
    }
  });
};

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) => 
      updateOpportunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
    }
  });
};

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
    }
  });
};
