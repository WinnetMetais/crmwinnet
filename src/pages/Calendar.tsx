
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, User } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      title: "Reunião com Cliente ABC",
      time: "09:00",
      type: "reunião",
      description: "Apresentação de proposta"
    },
    {
      id: 2,
      title: "Follow-up Orçamento L4090",
      time: "14:30",
      type: "follow-up",
      description: "Verificar status da proposta"
    },
    {
      id: 3,
      title: "Entrega - Metalúrgica XYZ",
      time: "16:00",
      type: "entrega",
      description: "50 lixeiras modelo L25"
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "reunião": return "bg-blue-100 text-blue-800";
      case "follow-up": return "bg-yellow-100 text-yellow-800";
      case "entrega": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Calendário</h1>
                  <p className="text-muted-foreground">Gerencie seus compromissos e tarefas</p>
                </div>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Eventos de Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{event.time}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant="outline" className={getEventColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Calendar;
