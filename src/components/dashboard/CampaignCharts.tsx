
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CampaignData {
  name: string;
  interna: number;
  agencia4k: number;
  conversoes: number;
}

interface FunnelData {
  name: string;
  value: number;
  color: string;
}

interface CampaignChartsProps {
  campaignData: CampaignData[];
  funnelData: FunnelData[];
}

export const CampaignCharts = ({ campaignData, funnelData }: CampaignChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Fontes de Tráfego */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Campanhas (Cliques)</CardTitle>
          <CardDescription>Comparativo entre campanhas internas e agência 4K</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="interna" name="Campanhas Internas" fill="#8884d8" />
                <Bar dataKey="agencia4k" name="Agência 4K" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Análise de Funil */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Distribuição por etapas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
