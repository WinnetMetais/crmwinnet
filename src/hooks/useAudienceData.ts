import { useQuery } from '@tanstack/react-query';

interface BehaviorData {
  name: string;
  valor: number;
}

interface LocationData {
  name: string;
  value: number;
}

interface DeviceData {
  name: string;
  value: number;
}

export interface AudienceData {
  behavior: BehaviorData[];
  location: LocationData[];
  device: DeviceData[];
}

// Simulação de dados - em produção, viria do Supabase
const mockAudienceData: AudienceData = {
  behavior: [
    { name: 'Novos', valor: 65 },
    { name: 'Recorrentes', valor: 35 },
    { name: 'Alta Engaj.', valor: 28 },
    { name: 'Baixo Engaj.', valor: 72 }
  ],
  location: [
    { name: 'São Paulo', value: 45 },
    { name: 'Rio de Janeiro', value: 20 },
    { name: 'Minas Gerais', value: 15 },
    { name: 'Outros', value: 20 }
  ],
  device: [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 30 },
    { name: 'Tablet', value: 5 }
  ]
};

export const useAudienceData = () => {
  return useQuery({
    queryKey: ['audience-data'],
    queryFn: async (): Promise<AudienceData> => {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAudienceData;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};