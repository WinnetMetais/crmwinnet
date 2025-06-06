
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Percent, 
  Settings, 
  Save, 
  RotateCcw,
  TrendingUp,
  Calculator
} from "lucide-react";
import { toast } from "sonner";

export const MarginConfiguration = () => {
  const [margins, setMargins] = useState({
    margin_50: 50,
    margin_55: 55,
    margin_60: 60,
    margin_65: 65,
    margin_70: 70,
    margin_75: 75
  });

  const [customMargins, setCustomMargins] = useState([
    { name: "Margem Promocional", value: 45, color: "bg-red-100 text-red-800" },
    { name: "Margem Premium", value: 80, color: "bg-purple-100 text-purple-800" },
  ]);

  const [categoryMargins] = useState([
    { category: "Aço Inox", margins: { min: 50, standard: 65, premium: 75 } },
    { category: "Alumínio", margins: { min: 55, standard: 70, premium: 80 } },
    { category: "Latão", margins: { min: 60, standard: 68, premium: 78 } },
    { category: "Cobre", margins: { min: 58, standard: 72, premium: 85 } },
  ]);

  const handleMarginChange = (key: string, value: number) => {
    setMargins(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveMargins = () => {
    // Simular salvamento
    toast.success("Margens padrão atualizadas com sucesso!");
  };

  const handleResetMargins = () => {
    setMargins({
      margin_50: 50,
      margin_55: 55,
      margin_60: 60,
      margin_65: 65,
      margin_70: 70,
      margin_75: 75
    });
    toast.info("Margens restauradas para os valores padrão");
  };

  const calculatePrice = (cost: number, margin: number) => {
    return cost / (1 - margin / 100);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="padrao" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="padrao">Margens Padrão</TabsTrigger>
          <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          <TabsTrigger value="customizadas">Customizadas</TabsTrigger>
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="padrao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Configuração de Margens Padrão
              </CardTitle>
              <CardDescription>
                Configure as margens padrão que serão aplicadas automaticamente aos produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.entries(margins).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>
                      {key.replace('margin_', 'Margem ')}%
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={key}
                        type="number"
                        value={value}
                        onChange={(e) => handleMarginChange(key, Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleSaveMargins}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Margens
                </Button>
                <Button variant="outline" onClick={handleResetMargins}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar Padrão
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview das Margens</CardTitle>
              <CardDescription>
                Visualize como as margens afetam o preço final (baseado em R$ 100 de custo)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(margins).map(([key, margin]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {key.replace('margin_', 'Margem ')}%
                      </span>
                      <Badge variant="outline">{margin}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Custo: R$ 100,00
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      Preço: R$ {calculatePrice(100, margin).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Margens por Categoria</CardTitle>
              <CardDescription>
                Configure margens específicas para cada categoria de produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryMargins.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">{item.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Margem Mínima</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input type="number" value={item.margins.min} />
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                      <div>
                        <Label>Margem Padrão</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input type="number" value={item.margins.standard} />
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                      <div>
                        <Label>Margem Premium</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input type="number" value={item.margins.premium} />
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customizadas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Margens Customizadas</CardTitle>
              <CardDescription>
                Crie margens personalizadas para situações específicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {customMargins.map((margin, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{margin.name}</h3>
                      <Badge className={margin.color}>{margin.value}%</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Nova Margem Customizada
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculadora" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Calculadora de Margens
              </CardTitle>
              <CardDescription>
                Calcule preços de venda baseados no custo e margem desejada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cost">Custo do Produto (R$)</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="100.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="desired-margin">Margem Desejada (%)</Label>
                    <Input
                      id="desired-margin"
                      type="number"
                      placeholder="65"
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Calcular Preço
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Resultado</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Custo:</span>
                      <span>R$ 0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem:</span>
                      <span>0%</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Preço de Venda:</span>
                      <span className="text-green-600">R$ 0,00</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Lucro:</span>
                      <span>R$ 0,00</span>
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
