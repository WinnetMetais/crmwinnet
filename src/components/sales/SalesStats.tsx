
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export const SalesStats = () => {
  const stats = [
    { 
      title: 'Receita Total', 
      value: 'R$ 458.750,00', 
      change: '+12.5%', 
      isPositive: true,
      description: 'vs. mês anterior'
    },
    { 
      title: 'Oportunidades Abertas', 
      value: '87', 
      change: '+5', 
      isPositive: true,
      description: 'vs. mês anterior'
    },
    { 
      title: 'Taxa de Conversão', 
      value: '21.8%', 
      change: '-2.3%', 
      isPositive: false,
      description: 'vs. mês anterior'
    },
    { 
      title: 'Ticket Médio', 
      value: 'R$ 15.950,00', 
      change: '+8.7%', 
      isPositive: true,
      description: 'vs. mês anterior'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`text-xs font-medium flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              {stat.change}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
