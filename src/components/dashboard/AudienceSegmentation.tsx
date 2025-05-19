
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AudienceSegmentationProps {
  colors: string[];
}

export const AudienceSegmentation = ({ colors }: AudienceSegmentationProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Segmentação de Público</CardTitle>
        <CardDescription>Análise por comportamento, localização e dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comportamento">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="comportamento">Comportamento</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="dispositivo">Dispositivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comportamento">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {name: 'Novos', valor: 65},
                  {name: 'Recorrentes', valor: 35},
                  {name: 'Alta Engaj.', valor: 28},
                  {name: 'Baixo Engaj.', valor: 72}
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="localizacao">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {name: 'São Paulo', value: 45},
                      {name: 'Rio de Janeiro', value: 20},
                      {name: 'Minas Gerais', value: 15},
                      {name: 'Outros', value: 20}
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {colors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="dispositivo">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {name: 'Mobile', value: 65},
                      {name: 'Desktop', value: 30},
                      {name: 'Tablet', value: 5}
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {colors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
