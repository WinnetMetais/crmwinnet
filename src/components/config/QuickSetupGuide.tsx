
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ArrowRight, 
  ExternalLink,
  Play,
  BookOpen,
  Zap
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QuickSetupGuideProps {
  onStartSetup: (platform: string) => void;
}

export const QuickSetupGuide: React.FC<QuickSetupGuideProps> = ({ onStartSetup }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const setupSteps = [
    {
      id: 'google',
      title: 'Google Ads',
      description: 'Configure sua conta Google Ads para campanhas automáticas',
      estimatedTime: '5 min',
      difficulty: 'Fácil',
      steps: [
        'Acesse o Google Ads',
        'Vá em Ferramentas → Configuração de API',
        'Gere as credenciais OAuth 2.0',
        'Cole as credenciais no sistema'
      ],
      docUrl: 'https://developers.google.com/google-ads/api/docs/oauth/overview'
    },
    {
      id: 'facebook',
      title: 'Facebook/Instagram Ads',
      description: 'Conecte suas páginas do Facebook e Instagram',
      estimatedTime: '7 min',
      difficulty: 'Médio',
      steps: [
        'Acesse o Facebook Business Manager',
        'Vá em Configurações → Contas de Anúncios',
        'Gere um token de acesso',
        'Configure as permissões necessárias'
      ],
      docUrl: 'https://developers.facebook.com/docs/marketing-api/get-started'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Ads',
      description: 'Configure campanhas profissionais no LinkedIn',
      estimatedTime: '10 min',
      difficulty: 'Avançado',
      steps: [
        'Acesse LinkedIn Developers',
        'Crie um aplicativo',
        'Configure o Marketing Developer Platform',
        'Gere o token OAuth 2.0'
      ],
      docUrl: 'https://www.linkedin.com/developers/apps'
    }
  ];

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-success/15 text-success';
      case 'Médio': return 'bg-warning/15 text-warning';
      case 'Avançado': return 'bg-destructive/15 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-blue-600" />
          Guia de Configuração Rápida
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Siga este guia passo a passo para configurar todas as suas integrações rapidamente
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900">Tempo total estimado</h4>
              <p className="text-sm text-blue-700">15-25 minutos para todas as integrações</p>
            </div>
            <Zap className="h-6 w-6 text-blue-600" />
          </div>

          <Accordion type="single" collapsible>
            {setupSteps.map((step, index) => (
              <AccordionItem key={step.id} value={step.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-2">
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                      )}
                      <span className="font-medium">{step.title}</span>
                    </div>
                    <div className="flex gap-2 ml-auto mr-4">
                      <Badge variant="outline" className="text-xs">
                        {step.estimatedTime}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(step.difficulty)}`}>
                        {step.difficulty}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Passos para configuração:</h5>
                      <ol className="list-decimal pl-4 space-y-1">
                        {step.steps.map((stepDescription, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {stepDescription}
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => onStartSetup(step.id)}
                        size="sm"
                        className="flex-1"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Começar Configuração
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={step.docUrl} target="_blank" rel="noopener noreferrer">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Documentação
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markStepComplete(step.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};
