import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/sidebar/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { listLeads, upsertLead, deleteLead } from '@/api/crm';
import { supabase } from '@/integrations/supabase/client';

export default function Leads() {
  useEffect(() => {
    document.title = 'Leads CRM | Winnet';
  }, []);

  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nome: '', empresa: '', email: '', telefone: '', origem: '', etapa: 'NOVO' });

  async function load() {
    setItems(await listLeads());
  }

  useEffect(() => {
    load();
  }, []);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel('rt-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  async function save() {
    await upsertLead(form);
    setForm({ nome: '', empresa: '', email: '', telefone: '', origem: '', etapa: 'NOVO' });
    await load();
  }

  async function remove(id: string) {
    if (confirm('Excluir lead?')) {
      await deleteLead(id);
      await load();
    }
  }

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />

        <div className="flex-1">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Leads</h1>
                <p className="text-muted-foreground">Cadastre e gerencie leads com atualização em tempo real</p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Novo Lead</CardTitle>
                <CardDescription>Preencha os campos para inserir um novo lead</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-6 gap-3">
                  {['nome', 'empresa', 'email', 'telefone', 'origem', 'etapa'].map((k) => (
                    <Input key={k} placeholder={k} value={form[k] || ''} onChange={(e) => set(k, e.target.value)} />
                  ))}
                  <Button className="md:col-span-6" onClick={save}>
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leads Cadastrados</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((x) => (
                      <TableRow key={x.id}>
                        <TableCell>{x.nome}</TableCell>
                        <TableCell>{x.empresa}</TableCell>
                        <TableCell>{x.email}</TableCell>
                        <TableCell>{x.telefone}</TableCell>
                        <TableCell>{x.origem}</TableCell>
                        <TableCell>{x.etapa}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => remove(x.id)}>
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
