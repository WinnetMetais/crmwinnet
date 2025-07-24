
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface NewContentFormProps {
  onClose: () => void;
}

type ContentType =
  | 'blog'
  | 'ebook'
  | 'infografico'
  | 'webinar'
  | 'video'
  | 'podcast'
  | 'post-social';

type ContentObjective =
  | 'conscientizacao'
  | 'educacao'
  | 'conversao'
  | 'lead'
  | 'autoridade'
  | 'engajamento';

export const NewContentForm = ({ onClose }: NewContentFormProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType | ''>('');
  const [objective, setObjective] = useState<ContentObjective | ''>('');
  const [persona, setPersona] = useState('');
  const [deadline, setDeadline] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [notes, setNotes] = useState('');

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: enviar dados para API ou serviço de persistência
    setTitle('');
    setType('');
    setObjective('');
    setPersona('');
    setDeadline('');
    setKeywords([]);
    setKeywordInput('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Conteúdo</DialogTitle>
          <DialogDescription>
            Adicione um novo item ao seu planejamento de conteúdo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Conteúdo</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Tipos de Aço Inox para Indústria"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Conteúdo</Label>
              <Select value={type} onValueChange={(value) => setType(value as ContentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="ebook">E-book</SelectItem>
                  <SelectItem value="infografico">Infográfico</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="post-social">Post Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo</Label>
              <Select value={objective} onValueChange={(value) => setObjective(value as ContentObjective)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conscientizacao">Conscientização</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="conversao">Conversão</SelectItem>
                  <SelectItem value="lead">Geração de Lead</SelectItem>
                  <SelectItem value="autoridade">Autoridade</SelectItem>
                  <SelectItem value="engajamento">Engajamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona">Persona Alvo</Label>
              <Input
                id="persona"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="Ex: Engenheiro Industrial"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Data de Vencimento</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave</Label>
            <div className="flex space-x-2">
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Digite uma palavra-chave"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas/Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações, briefing ou instruções específicas..."
              className="min-h-24"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Conteúdo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
