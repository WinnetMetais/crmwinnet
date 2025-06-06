
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Percent, 
  Plus,
  Edit,
  Trash2,
  FileText,
  Building
} from "lucide-react";
import { toast } from "sonner";

export const TaxConfiguration = () => {
  const [taxRates, setTaxRates] = useState([
    { id: 1, name: "ICMS - SP", rate: 18, type: "ICMS", state: "SP", active: true },
    { id: 2, name: "ICMS - RJ", rate: 20, type: "ICMS", state: "RJ", active: true },
    { id: 3, name: "ICMS - MG", rate: 18, type: "ICMS", state: "MG", active: true },
    { id: 4, name: "IPI - Metais", rate: 5, type: "IPI", state: "Nacional", active: true },
    { id: 5, name: "PIS/COFINS", rate: 9.25, type: "PIS/COFINS", state: "Nacional", active: true },
  ]);

  const [taxProfiles, setTaxProfiles] = useState([
    {
      id: 1,
      name: "Pessoa Física - SP",
      description: "Perfil para vendas para PF em São Paulo",
      taxes: ["ICMS - SP", "IPI - Metais"],
      active: true
    },
    {
      id: 2,
      name: "Pessoa Jurídica - Lucro Real",
      description: "Empresas no regime de Lucro Real",
      taxes: ["ICMS - SP", "IPI - Metais", "PIS/COFINS"],
      active: true
    },
    {
      id: 3,
      name: "Exportação",
      description: "Vendas para exportação",
      taxes: ["IPI - Metais"],
      active: true
    }
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    autoCalculateTaxes: true,
    showTaxesOnQuotes: true,
    includeInPrice: false,
    roundTaxes: true,
    defaultProfile: "Pessoa Jurídica - Lucro Real"
  });

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
      ? <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      : <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Alíquota
                </Button>
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
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Perfil
                </Button>
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-price">Incluir no Preço</Label>
                    <p className="text-sm text-muted-foreground">
                      Incluir impostos no preço de venda (preço único)
                    </p>
                  </div>
                  <Switch
                    id="include-price"
                    checked={generalSettings.includeInPrice}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, includeInPrice: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="round-taxes">Arredondar Impostos</Label>
                    <p className="text-sm text-muted-foreground">
                      Arredondar valores de impostos para 2 casas decimais
                    </p>
                  </div>
                  <Switch
                    id="round-taxes"
                    checked={generalSettings.roundTaxes}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, roundTaxes: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-profile">Perfil Padrão</Label>
                  <select 
                    id="default-profile"
                    className="w-full p-2 border rounded-md"
                    value={generalSettings.defaultProfile}
                    onChange={(e) => 
                      setGeneralSettings({...generalSettings, defaultProfile: e.target.value})
                    }
                  >
                    {taxProfiles.map((profile) => (
                      <option key={profile.id} value={profile.name}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
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
                    <select 
                      id="sim-profile"
                      className="w-full p-2 border rounded-md"
                    >
                      {taxProfiles.map((profile) => (
                        <option key={profile.id} value={profile.name}>
                          {profile.name}
                        </option>
                      ))}
                    </select>
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
                          <span className="text-muted-foreground">ICMS (18%):</span>
                          <span>R$ 0,00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IPI (5%):</span>
                          <span>R$ 0,00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PIS/COFINS (9.25%):</span>
                          <span>R$ 0,00</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total dos Impostos:</span>
                        <span className="text-red-600">R$ 0,00</span>
                      </div>
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
    </div>
  );
};
