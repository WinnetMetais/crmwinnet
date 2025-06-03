
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TagsSectionProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagsSection = ({ tags, onAddTag, onRemoveTag }: TagsSectionProps) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Adicionar tag..."
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
        />
        <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
          <Tag className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => onRemoveTag(tag)}>
              {tag} ✕
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
