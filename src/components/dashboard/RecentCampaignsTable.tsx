
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Campaign {
  nome: string;
  plataforma: string;
  impressoes: string;
  cliques: string;
  ctr: string;
  conversoes: string;
}

interface RecentCampaignsTableProps {
  campaigns: Campaign[];
}

export const RecentCampaignsTable = ({ campaigns }: RecentCampaignsTableProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Desempenho das Campanhas Recentes</CardTitle>
            <CardDescription>Impressões, cliques, CTR e conversões</CardDescription>
          </div>
          <Select defaultValue="todas">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as plataformas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as plataformas</SelectItem>
              <SelectItem value="google">Google Ads</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campanha</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Impressões</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Conversões</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campanha, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{campanha.nome}</TableCell>
                <TableCell>{campanha.plataforma}</TableCell>
                <TableCell>{campanha.impressoes}</TableCell>
                <TableCell>{campanha.cliques}</TableCell>
                <TableCell>{campanha.ctr}</TableCell>
                <TableCell>{campanha.conversoes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
