
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Users, Database, Shield, Bell, Palette, Mail, DollarSign } from "lucide-react";
import { PreferencesSection } from "@/components/config/PreferencesSection";
import { TeamSection } from "@/components/config/TeamSection";
import { EmailConfiguration } from "@/components/config/EmailConfiguration";
import { TaxConfiguration } from "@/components/config/TaxConfiguration";
import { MarginConfiguration } from "@/components/config/MarginConfiguration";
import { FieldCustomization } from "@/components/config/FieldCustomization";
import { SegmentManagement } from "@/components/config/SegmentManagement";

const Config = () => {
  const [activeTab, setActiveTab] = useState('preferences');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
              </div>
            </div>

            <Tabs defaultValue="preferences" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-8 w-full">
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferências
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Equipe
                </TabsTrigger>
                <TabsTrigger value="segments" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Segmentos
                </TabsTrigger>
                <TabsTrigger value="fields" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Campos
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="taxes" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Impostos
                </TabsTrigger>
                <TabsTrigger value="margins" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Margens
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preferences">
                <PreferencesSection />
              </TabsContent>

              <TabsContent value="team">
                <TeamSection />
              </TabsContent>

              <TabsContent value="segments">
                <SegmentManagement />
              </TabsContent>

              <TabsContent value="fields">
                <FieldCustomization />
              </TabsContent>

              <TabsContent value="email">
                <EmailConfiguration />
              </TabsContent>

              <TabsContent value="taxes">
                <TaxConfiguration />
              </TabsContent>

              <TabsContent value="margins">
                <MarginConfiguration />
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Notificações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        As configurações de notificações serão implementadas em breve.
                      </p>
                      <Badge variant="outline">Em desenvolvimento</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Config;
