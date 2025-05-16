
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIconFilled,
  UserPlus,
  Video,
  Search
} from "lucide-react";
import { ptBR } from "date-fns/locale";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Reunião com Cliente ABC',
      date: new Date(2025, 4, 15, 10, 30),
      endDate: new Date(2025, 4, 15, 11, 30),
      type: 'customer',
      status: 'confirmed',
      location: 'Escritório Central',
      attendees: ['Ana Silva', 'Carlos Santos', 'João Melo'],
      description: 'Apresentação de novos produtos de aço inox'
    },
    {
      id: 2,
      title: 'Entrega de Pedido #12547',
      date: new Date(2025, 4, 16, 9, 0),
      endDate: new Date(2025, 4, 16, 11, 0),
      type: 'delivery',
      status: 'confirmed',
      location: 'Cliente XYZ Ltda',
      attendees: ['Pedro Alves'],
      description: 'Entrega de 2 toneladas de alumínio 6061'
    },
    {
      id: 3,
      title: 'Visita Técnica - Indústria ABC',
      date: new Date(2025, 4, 18, 14, 0),
      endDate: new Date(2025, 4, 18, 16, 0),
      type: 'visit',
      status: 'pending',
      location: 'Planta do Cliente - São Paulo',
      attendees: ['Marina Costa', 'Ricardo Gomes'],
      description: 'Avaliação técnica para novo fornecimento'
    },
    {
      id: 4,
      title: 'Chamada com Fornecedor',
      date: new Date(2025, 4, 20, 11, 0),
      endDate: new Date(2025, 4, 20, 12, 0),
      type: 'meeting',
      status: 'confirmed',
      location: 'Online - Zoom',
      attendees: ['Juliana Mendes', 'Fornecedor Internacional'],
      description: 'Negociação de preços para o próximo trimestre'
    },
    {
      id: 5,
      title: 'Manutenção Programada',
      date: new Date(2025, 4, 22, 8, 0),
      endDate: new Date(2025, 4, 22, 17, 0),
      type: 'maintenance',
      status: 'confirmed',
      location: 'Fábrica - Setor 3',
      attendees: ['Equipe de Manutenção'],
      description: 'Manutenção preventiva em equipamentos'
    }
  ];

  // Adjust sample events to have some events on the current date
  const today = new Date();
  
  // Clone and set events for demo purposes
  const demoEvents = [
    ...events,
    {
      id: 6,
      title: 'Reunião de Equipe',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      type: 'internal',
      status: 'confirmed',
      location: 'Sala de Conferência',
      attendees: ['Toda a Equipe'],
      description: 'Reunião semanal de alinhamento'
    },
    {
      id: 7,
      title: 'Call com Cliente Potencial',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
      type: 'customer',
      status: 'confirmed',
      location: 'Online - Teams',
      attendees: ['Ana Silva', 'Carlos Santos'],
      description: 'Apresentação inicial de produtos'
    }
  ];

  // Get events for the selected date
  const selectedDateEvents = demoEvents.filter(event => 
    date && 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear()
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  // Helper function to get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivery':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'visit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meeting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'internal':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Calendário</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Evento
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Calendar Column */}
              <div className="lg:w-8/12">
                <Card className="mb-6">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>
                          {viewMode === 'month' 
                            ? format(date || new Date(), 'MMMM yyyy', { locale: ptBR })
                            : viewMode === 'week'
                            ? 'Semana Atual'
                            : format(date || new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })
                          }
                        </CardTitle>
                        <CardDescription>
                          Gerencie seus compromissos e eventos
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex border rounded-md overflow-hidden">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={viewMode === 'month' ? 'bg-muted' : ''} 
                            onClick={() => setViewMode('month')}
                          >
                            Mês
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={viewMode === 'week' ? 'bg-muted' : ''} 
                            onClick={() => setViewMode('week')}
                          >
                            Semana
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={viewMode === 'day' ? 'bg-muted' : ''} 
                            onClick={() => setViewMode('day')}
                          >
                            Dia
                          </Button>
                        </div>
                        
                        <div className="flex border rounded-md">
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (date) {
                              const newDate = new Date(date);
                              newDate.setMonth(newDate.getMonth() - 1);
                              setDate(newDate);
                            }
                          }}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDate(new Date())}>
                            Hoje
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (date) {
                              const newDate = new Date(date);
                              newDate.setMonth(newDate.getMonth() + 1);
                              setDate(newDate);
                            }
                          }}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="border rounded-md p-3"
                      locale={ptBR}
                    />
                  </CardContent>
                </Card>
                
                {/* Weekly/Daily View (simplified for demo) */}
                {viewMode !== 'month' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        {viewMode === 'day' ? (
                          // Day view
                          <div className="space-y-3">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const hour = 8 + i;
                              const timeSlot = `${hour}:00`;
                              const hasEvent = selectedDateEvents.some(
                                event => event.date.getHours() === hour
                              );
                              const event = selectedDateEvents.find(
                                event => event.date.getHours() === hour
                              );
                              
                              return (
                                <div key={i} className="flex">
                                  <div className="w-16 text-sm text-muted-foreground pt-2">
                                    {timeSlot}
                                  </div>
                                  <div className="flex-1 border-l pl-4 min-h-[60px]">
                                    {hasEvent ? (
                                      <div className={`p-2 rounded-md border ${getEventColor(event?.type || '')}`}>
                                        <p className="font-medium">{event?.title}</p>
                                        <div className="flex items-center text-sm">
                                          <MapPin className="h-3 w-3 mr-1" />
                                          {event?.location}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          // Week view (simplified)
                          <div className="grid grid-cols-7 gap-2">
                            {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"].map((day) => (
                              <div key={day} className="text-center">
                                <div className="font-medium mb-2">{day}</div>
                                <div className="border rounded-md min-h-[300px] p-2">
                                  {day === "QUA" && (
                                    <div className="bg-blue-100 text-blue-800 rounded-md p-2 mb-2 text-sm">
                                      <p className="font-medium">Reunião com Cliente</p>
                                      <p className="text-xs">10:30 - 11:30</p>
                                    </div>
                                  )}
                                  {day === "QUI" && (
                                    <div className="bg-green-100 text-green-800 rounded-md p-2 mb-2 text-sm">
                                      <p className="font-medium">Entrega de Pedido</p>
                                      <p className="text-xs">09:00 - 11:00</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Events Column */}
              <div className="lg:w-4/12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIconFilled className="mr-2 h-5 w-5" />
                      {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Eventos"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDateEvents.length === 0 
                        ? "Não há eventos programados para esta data"
                        : `${selectedDateEvents.length} eventos programados`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDateEvents.length === 0 ? (
                        <div className="text-center py-8">
                          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">Nenhum evento para esta data</p>
                          <Button className="mt-4" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Evento
                          </Button>
                        </div>
                      ) : (
                        selectedDateEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className={`border rounded-lg p-4 ${
                              event.status === 'pending' ? 'border-yellow-200' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge 
                                variant="outline" 
                                className={getEventColor(event.type)}
                              >
                                {event.type === 'customer' ? 'Cliente' : 
                                 event.type === 'delivery' ? 'Entrega' :
                                 event.type === 'visit' ? 'Visita' :
                                 event.type === 'meeting' ? 'Reunião' :
                                 event.type === 'internal' ? 'Interno' : 
                                 'Manutenção'}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {format(event.date, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                                </span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                              
                              {event.status === 'confirmed' ? (
                                <div className="flex items-center text-sm text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  <span>Confirmado</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-sm text-yellow-600">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  <span>Aguardando confirmação</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            
                            <div className="mt-4">
                              <p className="text-xs font-medium mb-2">Participantes</p>
                              <div className="flex items-center">
                                <div className="flex -space-x-2">
                                  {event.attendees.slice(0, 3).map((attendee, index) => (
                                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                      <AvatarFallback className="text-xs">
                                        {attendee.split(' ').map(name => name[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                {event.attendees.length > 3 && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    +{event.attendees.length - 3} mais
                                  </span>
                                )}
                                <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto">
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex gap-2">
                              <Button variant="outline" size="sm" className="w-full">
                                Editar
                              </Button>
                              {event.location.includes('Online') ? (
                                <Button size="sm" className="w-full">
                                  <Video className="h-3 w-3 mr-2" />
                                  Entrar
                                </Button>
                              ) : (
                                <Button size="sm" className="w-full">
                                  Detalhes
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Calendar;
