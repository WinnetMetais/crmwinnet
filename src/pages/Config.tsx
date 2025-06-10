
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Database, Shield, Bell, Palette, Mail, DollarSign, Zap } from "lucide-react";
import PreferencesSection from "@/components/config/PreferencesSection";
import { TeamSection } from "@/components/config/TeamSection";
import { EmailConfiguration } from "@/components/config/EmailConfiguration";
import { TaxConfiguration } from "@/components/config/TaxConfiguration";
import { MarginConfiguration } from "@/components/config/MarginConfiguration";
import { FieldCustomization } from "@/components/config/FieldCustomization";
import { SegmentManagement } from "@/components/config/SegmentManagement";
import { IntegrationsSection } from "@/components/config/IntegrationsSection";

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
              <div className="w-full overflow-x-auto">
                <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full min-w-max">
                  <TabsTrigger value="preferences" className="flex items-center gap-2 text-xs">
                    <Settings className="h-3 w-3" />
                    <span className="hidden sm:inline">Preferências</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center gap-2 text-xs">
                    <Users className="h-3 w-3" />
                    <span className="hidden sm:inline">Equipe</span>
                  </TabsTrigger>
                  <TabsTrigger value="segments" className="flex items-center gap-2 text-xs">
                    <Database className="h-3 w-3" />
                    <span className="hidden sm:inline">Segmentos</span>
                  </TabsTrigger>
                  <TabsTrigger value="fields" className="flex items-center gap-2 text-xs">
                    <Shield className="h-3 w-3" />
                    <span className="hidden sm:inline">Campos</span>
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="flex items-center gap-2 text-xs">
                    <Zap className="h-3 w-3" />
                    <span className="hidden sm:inline">Integrações</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2 text-xs">
                    <Mail className="h-3 w-3" />
                    <span className="hidden sm:inline">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="taxes" className="flex items-center gap-2 text-xs">
                    <DollarSign className="h-3 w-3" />
                    <span className="hidden sm:inline">Impostos</span>
                  </TabsTrigger>
                  <TabsTrigger value="margins" className="flex items-center gap-2 text-xs">
                    <Palette className="h-3 w-3" />
                    <span className="hidden sm:inline">Margens</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs">
                    <Bell className="h-3 w-3" />
                    <span className="hidden sm:inline">Notificações</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preferences">
                <PreferencesSection />
              </TabsContent>

              <TabsContent value="team">
                <TeamSection appUrl={window.location.origin} />
              </TabsContent>

              <TabsContent value="segments">
                <SegmentManagement />
              </TabsContent>

              <TabsContent value="fields">
                <FieldCustomization />
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationsSection />
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
