import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'evento', label: 'Evento' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'email', label: 'E-mail' },
  { value: 'visita', label: 'Visita' },
  { value: 'outros', label: 'Outros' }
];

export const SALES_CHANNELS = [
  { value: 'online', label: 'Online' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'representante', label: 'Representante' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'parceiro', label: 'Parceiro' },
  { value: 'loja_fisica', label: 'Loja Física' }
];

interface LeadSourceSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const LeadSourceSelect = ({ value, onValueChange, placeholder = "Selecione a origem" }: LeadSourceSelectProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {LEAD_SOURCES.map((source) => (
        <SelectItem key={source.value} value={source.value}>
          {source.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface ChannelSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const ChannelSelect = ({ value, onValueChange, placeholder = "Selecione o canal" }: ChannelSelectProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {SALES_CHANNELS.map((channel) => (
        <SelectItem key={channel.value} value={channel.value}>
          {channel.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);