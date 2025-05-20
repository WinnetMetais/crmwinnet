
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Winnet Metais</h1>
          <p className="text-slate-600 mt-2">Sistema de Gestão de Marketing e Vendas</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-slate-600">
              O painel de login foi removido temporariamente e será implementado posteriormente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
