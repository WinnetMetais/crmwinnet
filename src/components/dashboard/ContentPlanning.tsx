
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export const ContentPlanning = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planejamento de Conteúdo</CardTitle>
        <CardDescription>Postagens da agência 4K</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Conecte a API de Marketing para visualizar o planejamento de conteúdo</p>
          <Button className="mt-4" asChild>
            <a href="/config">Configurar Integrações</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
