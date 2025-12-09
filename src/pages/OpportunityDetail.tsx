import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, ArrowLeft, Calendar, DollarSign, User, Tags } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUnifiedRealtimeSync } from '@/hooks/useUnifiedRealtimeSync';

interface Opportunity {
  id: string;
  title: string;
  customer_id: string | null;
  value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  actual_close_date: string | null;
  description: string | null;
  stage: string;
  status: string | null;
  lead_source: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

const stageLabel = (s: string) => {
  const m: Record<string, string> = {
    prospecting: "Prospecção",
    qualification: "Qualificação",
    proposal: "Proposta",
    negotiation: "Negociação",
    won: "Ganhou",
    lost: "Perdido",
  };
  return m[s] ?? s;
};

const stageClass = (s: string) => {
  switch (s) {
    case "prospecting":
      return "bg-primary/10 text-primary";
    case "qualification":
      return "bg-warning/10 text-warning";
    case "proposal":
      return "bg-orange-500/10 text-orange-600";
    case "negotiation":
      return "bg-purple-500/10 text-purple-600";
    case "won":
      return "bg-green-500/10 text-green-600";
    case "lost":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-foreground";
  }
};

const formatBRL = (n?: number | null) =>
  typeof n === "number" ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-";

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useUnifiedRealtimeSync();

  useEffect(() => {
    // SEO basics
    const title = opportunity ? `${opportunity.title} | Oportunidade` : "Detalhe da Oportunidade";
    document.title = title;
    const desc = opportunity
      ? `Detalhes da oportunidade ${opportunity.title} no estágio ${stageLabel(opportunity.stage)}`
      : "Visualize detalhes da oportunidade";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", desc);
      document.head.appendChild(meta);
    } else {
      meta.setAttribute("content", desc);
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", window.location.href);
      document.head.appendChild(canonical);
    } else {
      canonical.setAttribute("href", window.location.href);
    }
  }, [opportunity]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data: opp, error: e1 } = await supabase
          .from("opportunities")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (e1) throw e1;
        if (!opp) {
          setError("Oportunidade não encontrada");
          setLoading(false);
          return;
        }
        // @ts-ignore - Opportunity type conversion
        setOpportunity(opp as Opportunity);
        if (opp.customer_id) {
          const { data: cust } = await supabase
            .from("customers")
            .select("name")
            .eq("id", opp.customer_id)
            .maybeSingle();
          setCustomerName(cust?.name || "");
        }
      } catch (e: any) {
        setError(e.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const prob = useMemo(() => (opportunity?.probability ?? 0), [opportunity]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" /> Carregando oportunidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Erro</span>
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!opportunity) return null;

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </nav>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="h-5 w-5" />
            <span>{opportunity.title}</span>
            <Badge className={stageClass(opportunity.stage)}>{stageLabel(opportunity.stage)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>Cliente</span>
                <Separator orientation="vertical" className="mx-2" />
                <span className="font-medium">{customerName || opportunity.customer_id || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                <span>Valor Estimado</span>
                <Separator orientation="vertical" className="mx-2" />
                <span className="font-medium">{formatBRL(opportunity.value)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Fechamento Previsto</span>
                <Separator orientation="vertical" className="mx-2" />
                <span className="font-medium">
                  {opportunity.expected_close_date
                    ? new Date(opportunity.expected_close_date).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Probabilidade</span>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${prob}%` }} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{prob}%</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Descrição</span>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {opportunity.description || "Sem descrição"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tags className="h-4 w-4" />
                <span>Status</span>
                <Separator orientation="vertical" className="mx-2" />
                <span className="font-medium">{opportunity.status || "active"}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>Responsável: <span className="font-medium text-foreground">{opportunity.assigned_to || '-'}</span></div>
                <div>Criado em: <span className="font-medium text-foreground">{new Date(opportunity.created_at).toLocaleString('pt-BR')}</span></div>
                <div>Atualizado em: <span className="font-medium text-foreground">{new Date(opportunity.updated_at).toLocaleString('pt-BR')}</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunityDetail;
