import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  Percent, 
  Plus,
  Edit,
  Trash2,
  FileText,
  Building
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: string;
  state: string;
  active: boolean;
}

interface TaxProfile {
  id: string;
  name: string;
  description: string;
  taxes: string[];
  active: boolean;
}

export const TaxConfigurationFunctional = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [taxProfiles, setTaxProfiles] = useState<TaxProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [editingProfile, setEditingProfile] = useState<TaxProfile | null>(null);
  
  const [newTax, setNewTax] = useState({
    name: '',
    rate: 0,
    type: 'ICMS',
    state: '',
    active: true
  });

  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    taxes: [] as string[],
    active: true
  });

  const [generalSettings, setGeneralSettings] = useState({
    autoCalculateTaxes: true,
    showTaxesOnQuotes: true,
    includeInPrice: false,
    roundTaxes: true,
    defaultProfile: ""
  });

  // Carregar dados
  useEffect(() => {
    loadTaxData();
  }, []);

  const loadTaxData = async () => {
    try {
      setLoading(true);
      
      // Carregar alíquotas (simulado - pode conectar com Supabase)
      const mockTaxRates = [
        { id: '1', name: "ICMS - SP", rate: 18, type: "ICMS", state: "SP", active: true },
        { id: '2', name: "ICMS - RJ", rate: 20, type: "ICMS", state: "RJ", active: true },
        { id: '3', name: "IPI - Metais", rate: 5, type: "IPI", state: "Nacional", active: true },
        { id: '4', name: "PIS/COFINS", rate: 9.25, type: "PIS/COFINS", state: "Nacional", active: true },
      ];
      
      const mockProfiles = [
        {
          id: '1',
          name: "Pessoa Física - SP",
          description: "Perfil para vendas para PF em São Paulo",
          taxes: ["ICMS - SP", "IPI - Metais"],
          active: true
        },
        {
          id: '2',
          name: "Pessoa Jurídica - Lucro Real",
          description: "Empresas no regime de Lucro Real",
          taxes: ["ICMS - SP", "IPI - Metais", "PIS/COFINS"],
          active: true
        }
      ];

      setTaxRates(mockTaxRates);
      setTaxProfiles(mockProfiles);
      setGeneralSettings(prev => ({ ...prev, defaultProfile: mockProfiles[0]?.name || '' }));
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações tributárias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTax = async () => {
    if (!newTax.name || !newTax.state || newTax.rate <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const taxRate: TaxRate = {
      id: Math.random().toString(),
      ...newTax
    };

    setTaxRates(prev => [...prev, taxRate]);
    setNewTax({ name: '', rate: 0, type: 'ICMS', state: '', active: true });
    
    toast({
      title: "Sucesso",
      description: "Alíquota criada com sucesso!",
    });
  };

  const handleEditTax = (tax: TaxRate) => {
    setEditingTax(tax);
  };

  const handleUpdateTax = () => {
    if (!editingTax) return;

    setTaxRates(prev => prev.map(tax => 
      tax.id === editingTax.id ? editingTax : tax
    ));
    setEditingTax(null);
    
    toast({
      title: "Sucesso",
      description: "Alíquota atualizada com sucesso!",
    });
  };

  const handleDeleteTax = (id: string) => {
    setTaxRates(prev => prev.filter(tax => tax.id !== id));
    toast({
      title: "Sucesso",
      description: "Alíquota removida com sucesso!",
    });
  };

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const profile: TaxProfile = {
      id: Math.random().toString(),
      ...newProfile
    };

    setTaxProfiles(prev => [...prev, profile]);
    setNewProfile({ name: '', description: '', taxes: [], active: true });
    
    toast({
      title: "Sucesso",
      description: "Perfil tributário criado com sucesso!",
    });
  };

  const calculateTotalTax = (taxes: string[]) => {
    return taxes.reduce((total, taxName) => {
      const tax = taxRates.find(t => t.name === taxName);
      return total + (tax ? tax.rate : 0);
    }, 0);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ICMS": return "bg-blue-100 text-blue-800";
      case "IPI": return "bg-green-100 text-green-800";
      case "PIS/COFINS": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active 
      ? <Badge variant="success">Ativo</Badge>
      : <Badge variant="destructive">Inativo</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="aliquotas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="aliquotas">Alíquotas</TabsTrigger>
          <TabsTrigger value="perfis">Perfis Tributários</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="simulador">Simulador</TabsTrigger>
        </TabsList>

        <TabsContent value="aliquotas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2" />
                    Alíquotas de Impostos
                  </CardTitle>
                  <CardDescription>
                    Configure as alíquotas de impostos por estado e tipo
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Alíquota
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Alíquota de Imposto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tax-name">Nome da Alíquota</Label>
                        <Input
                          id="tax-name"
                          value={newTax.name}
                          onChange={(e) => setNewTax({...newTax, name: e.target.value})}
                          placeholder="Ex: ICMS - SP"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tax-type">Tipo</Label>
                          <Select value={newTax.type} onValueChange={(value) => setNewTax({...newTax, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ICMS">ICMS</SelectItem>
                              <SelectItem value="IPI">IPI</SelectItem>
                              <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                              <SelectItem value="ISS">ISS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tax-rate">Alíquota (%)</Label>
                          <Input
                            id="tax-rate"
                            type="number"
                            step="0.01"
                            value={newTax.rate}
                            onChange={(e) => setNewTax({...newTax, rate: parseFloat(e.target.value) || 0})}
                            placeholder="18"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tax-state">Estado/Região</Label>
                        <Input
                          id="tax-state"
                          value={newTax.state}
                          onChange={(e) => setNewTax({...newTax, state: e.target.value})}
                          placeholder="SP, RJ, Nacional, etc."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newTax.active}
                          onCheckedChange={(checked) => setNewTax({...newTax, active: checked})}
                        />
                        <Label>Alíquota Ativa</Label>
                      </div>
                      <Button onClick={handleCreateTax} className="w-full">
                        Criar Alíquota
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxRates.map((tax) => (
                  <div key={tax.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{tax.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge className={getTypeColor(tax.type)} variant="outline">
                            {tax.type}
                          </Badge>
                          <span>•</span>
                          <span>{tax.state}</span>
                          <span>•</span>
                          <span className="font-medium text-lg text-green-600">
                            {tax.rate}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(tax.active)}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTax(tax)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteTax(tax.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfis" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Perfis Tributários
                  </CardTitle>
                  <CardDescription>
                    Agrupe impostos em perfis para diferentes tipos de clientes
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Perfil Tributário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome do Perfil</Label>
                        <Input
                          value={newProfile.name}
                          onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                          placeholder="Ex: Pessoa Física - SP"
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input
                          value={newProfile.description}
                          onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                          placeholder="Descrição do perfil tributário"
                        />
                      </div>
                      <div>
                        <Label>Impostos</Label>
                        <div className="space-y-2">
                          {taxRates.filter(tax => tax.active).map((tax) => (
                            <div key={tax.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={newProfile.taxes.includes(tax.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewProfile({...newProfile, taxes: [...newProfile.taxes, tax.name]});
                                  } else {
                                    setNewProfile({...newProfile, taxes: newProfile.taxes.filter(t => t !== tax.name)});
                                  }
                                }}
                              />
                              <Label>{tax.name} ({tax.rate}%)</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleCreateProfile} className="w-full">
                        Criar Perfil
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taxProfiles.map((profile) => (
                  <Card key={profile.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        {getStatusBadge(profile.active)}
                      </div>
                      <CardDescription>{profile.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Impostos Incluídos:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.taxes.map((taxName, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {taxName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total de Impostos:</span>
                            <span className="text-lg font-bold text-green-600">
                              {calculateTotalTax(profile.taxes).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" className="flex-1">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure como os impostos são calculados e exibidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-calculate">Cálculo Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Calcular impostos automaticamente nos orçamentos
                    </p>
                  </div>
                  <Switch
                    id="auto-calculate"
                    checked={generalSettings.autoCalculateTaxes}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, autoCalculateTaxes: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-taxes">Exibir nos Orçamentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar discriminação de impostos nos orçamentos
                    </p>
                  </div>
                  <Switch
                    id="show-taxes"
                    checked={generalSettings.showTaxesOnQuotes}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, showTaxesOnQuotes: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-profile">Perfil Padrão</Label>
                  <Select 
                    value={generalSettings.defaultProfile}
                    onValueChange={(value) => 
                      setGeneralSettings({...generalSettings, defaultProfile: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxProfiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.name}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulador" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Simulador de Impostos
              </CardTitle>
              <CardDescription>
                Simule o cálculo de impostos para diferentes cenários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sim-value">Valor Base (R$)</Label>
                    <Input
                      id="sim-value"
                      type="number"
                      placeholder="1000.00"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sim-profile">Perfil Tributário</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.name}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular Impostos
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Resultado da Simulação</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Valor Base:</span>
                      <span>R$ 0,00</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="text-sm font-medium mb-2">Impostos:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total de Impostos:</span>
                          <span>R$ 0,00</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Valor Final:</span>
                        <span className="text-green-600">R$ 0,00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Edição de Alíquota */}
      {editingTax && (
        <Dialog open={!!editingTax} onOpenChange={() => setEditingTax(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Alíquota</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome da Alíquota</Label>
                <Input
                  value={editingTax.name}
                  onChange={(e) => setEditingTax({...editingTax, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={editingTax.type} onValueChange={(value) => setEditingTax({...editingTax, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICMS">ICMS</SelectItem>
                      <SelectItem value="IPI">IPI</SelectItem>
                      <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                      <SelectItem value="ISS">ISS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Alíquota (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingTax.rate}
                    onChange={(e) => setEditingTax({...editingTax, rate: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <Label>Estado/Região</Label>
                <Input
                  value={editingTax.state}
                  onChange={(e) => setEditingTax({...editingTax, state: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingTax.active}
                  onCheckedChange={(checked) => setEditingTax({...editingTax, active: checked})}
                />
                <Label>Alíquota Ativa</Label>
              </div>
              <Button onClick={handleUpdateTax} className="w-full">
                Atualizar Alíquota
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};