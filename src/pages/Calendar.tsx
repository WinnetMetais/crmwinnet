
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus, ChevronLeft, ChevronRight, Users, Target, FileText, Megaphone, Clock, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Reunião com Cliente ABC',
      type: 'Reunião',
      date: new Date('2025-05-18'),
      time: '10:00',
      description: 'Apresentação da proposta comercial',
      participants: ['Carlos Silva', 'Maria Souza'],
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 2,
      title: 'Postagem LinkedIn',
      type: 'Social',
      date: new Date('2025-05-20'),
      time: '14:00',
      description: 'Post sobre o novo aço carbono',
      participants: ['Marketing'],
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 3,
      title: 'Campanha Google Ads',
      type: 'Marketing',
      date: new Date('2025-05-21'),
      time: '09:00',
      description: 'Lançamento da campanha para aço inox',
      participants: ['Agência 4K', 'Marketing'],
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 4,
      title: 'Definição de Metas Mensais',
      type: 'Interno',
      date: new Date('2025-05-28'),
      time: '11:00',
      description: 'Reunião para definir metas do próximo mês',
      participants: ['Diretoria', 'Gerentes'],
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    {
      id: 5,
      title: 'Visita Técnica - Cliente XYZ',
      type: 'Externo',
      date: new Date('2025-05-22'),
      time: '09:30',
      description: 'Visita para avaliação técnica',
      participants: ['Paulo Mendes', 'Eng. Roberto'],
      color: 'bg-red-100 border-red-300 text-red-800'
    }
  ];

  // Get today's events
  const todayEvents = events.filter(
    event => event.date.toDateString() === new Date().toDateString()
  );

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const inOneWeek = new Date();
    inOneWeek.setDate(today.getDate() + 7);
    return eventDate > today && eventDate <= inOneWeek;
  });

  // Get events for selected date
  const selectedDateEvents = date ? 
    events.filter(event => event.date.toDateString() === date.toDateString()) : [];

  // Event types
  const eventTypes = [
    { type: 'Reunião', icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    { type: 'Social', icon: <FileText className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    { type: 'Marketing', icon: <Megaphone className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
    { type: 'Interno', icon: <Target className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { type: 'Externo', icon: <CalendarIcon2 className="h-4 w-4" />, color: 'bg-red-100 text-red-800' }
  ];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Agenda</h1>
                  <p className="text-muted-foreground">Gerencie todos os eventos e compromissos</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Evento</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do evento e clique em salvar
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Título
                        </Label>
                        <Input id="title" placeholder="Título do evento" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Tipo
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o tipo de evento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reuniao">Reunião</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="interno">Interno</SelectItem>
                            <SelectItem value="externo">Externo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Data
                        </Label>
                        <div className="col-span-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Horário
                        </Label>
                        <Input id="time" type="time" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Descrição
                        </Label>
                        <Input id="description" placeholder="Descrição do evento" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="participants" className="text-right">
                          Participantes
                        </Label>
                        <Input id="participants" placeholder="Participantes separados por vírgula" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setShowAddEventDialog(false)}>
                        Salvar Evento
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Select defaultValue={view} onValueChange={setView}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione a visualização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Diária</SelectItem>
                    <SelectItem value="week">Semanal</SelectItem>
                    <SelectItem value="month">Mensal</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => {
                    const newDate = new Date(date || new Date());
                    if (view === 'day') {
                      newDate.setDate(newDate.getDate() - 1);
                    } else if (view === 'week') {
                      newDate.setDate(newDate.getDate() - 7);
                    } else {
                      newDate.setMonth(newDate.getMonth() - 1);
                    }
                    setDate(newDate);
                  }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setDate(new Date())}>
                    Hoje
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => {
                    const newDate = new Date(date || new Date());
                    if (view === 'day') {
                      newDate.setDate(newDate.getDate() + 1);
                    } else if (view === 'week') {
                      newDate.setDate(newDate.getDate() + 7);
                    } else {
                      newDate.setMonth(newDate.getMonth() + 1);
                    }
                    setDate(newDate);
                  }}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Calendar Sidebar */}
              <div className="space-y-6">
                {/* Mini Calendar */}
                <Card>
                  <CardContent className="p-4">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border p-3 pointer-events-auto"
                    />
                  </CardContent>
                </Card>
                
                {/* Event Types */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Tipos de Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {eventTypes.map((eventType, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${eventType.color}`}>
                            {eventType.icon}
                          </div>
                          <span>{eventType.type}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Gerenciar Tipos
                    </Button>
                  </CardFooter>
                </Card>

                {/* Today's Events */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Eventos de Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayEvents.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Nenhum evento programado para hoje.</p>
                      ) : (
                        todayEvents.map((event, index) => (
                          <div 
                            key={index} 
                            className={`p-3 border rounded-md cursor-pointer hover:shadow-sm transition-shadow ${event.color}`}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Calendar View */}
              <div className="md:col-span-2">
                {selectedEvent ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <Badge 
                            variant="outline" 
                            className={eventTypes.find(t => t.type === selectedEvent.type)?.color || ""}
                          >
                            {selectedEvent.type}
                          </Badge>
                          <CardTitle className="mt-2">{selectedEvent.title}</CardTitle>
                          <CardDescription>{format(selectedEvent.date, "PPP", { locale: ptBR })} às {selectedEvent.time}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                          Voltar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Descrição</h4>
                          <p>{selectedEvent.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Participantes</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.participants.map((participant: string, i: number) => (
                              <Badge key={i} variant="secondary">{participant}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Editar</Button>
                      <Button variant="destructive">Excluir</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Tabs value={view} onValueChange={setView}>
                    <TabsContent value="month">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {date && format(date, "MMMM yyyy", { locale: ptBR })}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Month view - show calendar grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                              <div key={day} className="text-center font-medium py-1">
                                {day}
                              </div>
                            ))}
                            
                            {/* Calendar days grid - simplified example */}
                            {Array.from({ length: 35 }, (_, i) => {
                              const d = new Date(date || new Date());
                              d.setDate(1);
                              const firstDayOfMonth = d.getDay();
                              d.setDate(i - firstDayOfMonth + 1);
                              
                              const isCurrentMonth = d.getMonth() === (date?.getMonth() || new Date().getMonth());
                              const isToday = d.toDateString() === new Date().toDateString();
                              
                              const dayEvents = events.filter(event => 
                                event.date.toDateString() === d.toDateString()
                              );
                              
                              return (
                                <div 
                                  key={i} 
                                  className={cn(
                                    "min-h-24 border p-1 hover:bg-gray-50 cursor-pointer transition-colors",
                                    isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400",
                                    isToday && "border-blue-500 border-2"
                                  )}
                                  onClick={() => setDate(new Date(d))}
                                >
                                  <div className="text-right p-1">{d.getDate()}</div>
                                  <div className="space-y-1">
                                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                      <div 
                                        key={eventIndex}
                                        className={`px-2 py-1 text-xs rounded truncate ${event.color}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEventClick(event);
                                        }}
                                      >
                                        {event.time} {event.title}
                                      </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                      <div className="text-xs text-muted-foreground text-right">
                                        +{dayEvents.length - 3} mais
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="week">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {date && `Semana de ${format(date, "d 'de' MMMM", { locale: ptBR })}`}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Array.from({ length: 7 }, (_, i) => {
                              const d = new Date(date || new Date());
                              d.setDate(d.getDate() - d.getDay() + i);
                              
                              const dayEvents = events.filter(event => 
                                event.date.toDateString() === d.toDateString()
                              );
                              
                              return (
                                <div key={i} className="border rounded-md overflow-hidden">
                                  <div 
                                    className={cn(
                                      "bg-gray-50 p-2 font-medium",
                                      d.toDateString() === new Date().toDateString() && "bg-blue-50 text-blue-800"
                                    )}
                                  >
                                    {format(d, "EEEE, d 'de' MMMM", { locale: ptBR })}
                                  </div>
                                  
                                  {dayEvents.length > 0 ? (
                                    <div className="p-2 space-y-2">
                                      {dayEvents.map((event, eventIndex) => (
                                        <div 
                                          key={eventIndex}
                                          className={`p-2 rounded ${event.color} cursor-pointer`}
                                          onClick={() => handleEventClick(event)}
                                        >
                                          <div className="font-medium">{event.title}</div>
                                          <div className="text-sm flex items-center mt-1">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {event.time}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="p-4 text-center text-muted-foreground">
                                      Nenhum evento programado
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="day">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {date && format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedDateEvents.length > 0 ? (
                            <div className="space-y-4">
                              {selectedDateEvents.map((event, index) => (
                                <div 
                                  key={index} 
                                  className={`p-4 border rounded-md cursor-pointer hover:shadow-sm transition-shadow ${event.color}`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium text-lg">{event.title}</div>
                                      <div className="text-sm flex items-center mt-2">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {event.time}
                                      </div>
                                      {event.description && (
                                        <p className="mt-2">{event.description}</p>
                                      )}
                                    </div>
                                    <Badge variant="outline">{event.type}</Badge>
                                  </div>
                                  
                                  {event.participants && event.participants.length > 0 && (
                                    <div className="mt-3">
                                      <div className="text-sm font-medium mb-1">Participantes:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {event.participants.map((participant: string, i: number) => (
                                          <Badge key={i} variant="secondary">{participant}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                              <h3 className="mt-4 text-lg font-medium">Nenhum evento para este dia</h3>
                              <p className="mt-2 text-muted-foreground">
                                Adicione um novo evento clicando no botão "Novo Evento".
                              </p>
                              <Button 
                                className="mt-4" 
                                onClick={() => setShowAddEventDialog(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Evento
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}

                {/* Upcoming Events */}
                {!selectedEvent && (
                  <Card className="mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle>Próximos Eventos</CardTitle>
                      <CardDescription>Eventos agendados para os próximos 7 dias</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingEvents.length === 0 ? (
                          <p className="text-muted-foreground text-sm">Nenhum evento agendado para os próximos dias.</p>
                        ) : (
                          upcomingEvents.map((event, index) => (
                            <div 
                              key={index} 
                              className={`p-3 border rounded-md flex justify-between items-center cursor-pointer hover:shadow-sm transition-shadow`}
                              onClick={() => handleEventClick(event)}
                            >
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(event.date, "P", { locale: ptBR })} às {event.time}
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={eventTypes.find(t => t.type === event.type)?.color || ""}
                              >
                                {event.type}
                              </Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Calendar;
