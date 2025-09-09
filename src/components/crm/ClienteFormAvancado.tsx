import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin,
  FileText,
  Plus,
  ArrowLeft,
  ArrowRight,
  Save
} from 'lucide-react';
import { useCRM, Cliente } from '@/contexts/CRMContext';
import { useToast } from '@/hooks/use-toast';

interface ClienteFormData {
  // Dados pessoais
  name: string;
  email: string;
  phone: string;
  
  // Dados da empresa
  company: string;
  cnpj: string;
  
  // Endereço
  address: string;
  city: string;
  state: string;
  zip_code: string;
  
  // Informações comerciais
  canal: Cliente['canal'];
  lead_source: string;
  
  // Observações
  observacoes: string;
}

const passos = [
  'Dados Pessoais',
  'Empresa',
  'Localização', 
  'Origem',
  'Observações'
];

interface ClienteFormAvancadoProps {
  onSubmit?: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel?: () => void;
  initialData?: Partial<ClienteFormData>;
}

export const ClienteFormAvancado: React.FC<ClienteFormAvancadoProps> = ({ 
  onSubmit,
  onCancel,
  initialData 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ClienteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    canal: 'Orgânico',
    lead_source: '',
    observacoes: '',
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { adicionarCliente } = useCRM();
  const { toast } = useToast();

  const updateFormData = (field: keyof ClienteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < passos.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Dados Pessoais
        return !!(formData.name && formData.email && formData.phone);
      case 1: // Empresa
        return true; // Opcional
      case 2: // Localização
        return true; // Opcional
      case 3: // Origem
        return !!formData.canal;
      case 4: // Observações
        return true; // Opcional
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      const clienteData = {
        ...formData,
        fase: 'lead' as const,
        status: 'active'
      };

      if (onSubmit) {
        onSubmit(clienteData);
      } else {
        await adicionarCliente(clienteData);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        cnpj: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        canal: 'Orgânico',
        lead_source: '',
        observacoes: '',
      });
      setCurrentStep(0);

      toast({
        title: "Cliente cadastrado!",
        description: `${clienteData.name} foi adicionado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o cliente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-medium">Dados Pessoais</h3>
              <p className="text-sm text-muted-foreground">
                Informações básicas do cliente
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="joao@empresa.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Building className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-medium">Dados da Empresa</h3>
              <p className="text-sm text-muted-foreground">
                Informações da empresa do cliente (opcional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => updateFormData('company', e.target.value)}
                placeholder="Ex: Empresa LTDA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => updateFormData('cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-medium">Localização</h3>
              <p className="text-sm text-muted-foreground">
                Endereço do cliente (opcional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="Rua, número, complemento"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  placeholder="SP"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">CEP</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => updateFormData('zip_code', e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-primary font-bold">?</span>
              </div>
              <h3 className="text-lg font-medium">Origem do Lead</h3>
              <p className="text-sm text-muted-foreground">
                Como o cliente chegou até você?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canal">Canal de Origem *</Label>
              <Select
                value={formData.canal}
                onValueChange={(value) => updateFormData('canal', value as Cliente['canal'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Facebook/Instagram">Facebook/Instagram</SelectItem>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                  <SelectItem value="Orgânico">Orgânico</SelectItem>
                  <SelectItem value="Frio">Frio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead_source">Detalhes da Origem</Label>
              <Input
                id="lead_source"
                value={formData.lead_source}
                onChange={(e) => updateFormData('lead_source', e.target.value)}
                placeholder="Ex: Campanha Google Ads, Indicação de João"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-medium">Observações</h3>
              <p className="text-sm text-muted-foreground">
                Informações adicionais sobre o cliente
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => updateFormData('observacoes', e.target.value)}
                placeholder="Notas importantes, preferências, histórico de interações..."
                rows={4}
              />
            </div>

            {/* Resumo dos dados */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Resumo dos Dados</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Telefone:</strong> {formData.phone}</p>
                {formData.company && (
                  <p><strong>Empresa:</strong> {formData.company}</p>
                )}
                <p><strong>Canal:</strong> {formData.canal}</p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Novo Cliente
        </CardTitle>
        <CardDescription>
          Cadastre um novo cliente seguindo o processo passo a passo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Stepper currentStep={currentStep} steps={passos} />
        
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            
            {currentStep < passos.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? 'Salvando...' : 'Finalizar'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};