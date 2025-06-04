
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { revenueCategories, expenseCategories } from "@/constants/transactionCategories";

interface CategorySectionProps {
  type: 'receita' | 'despesa';
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

export const CategorySection = ({ type, category, subcategory, onCategoryChange, onSubcategoryChange }: CategorySectionProps) => {
  const getCurrentCategories = () => {
    return type === 'receita' ? revenueCategories : expenseCategories;
  };

  const getSubcategories = () => {
    if (!category) return [];
    const categories = getCurrentCategories();
    return categories[category as keyof typeof categories] || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select 
          value={category} 
          onValueChange={onCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(getCurrentCategories()).map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subcategory">Subcategoria</Label>
        <Select 
          value={subcategory} 
          onValueChange={onSubcategoryChange}
          disabled={!category}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {getSubcategories().map((subcat) => (
              <SelectItem key={subcat} value={subcat}>
                {subcat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
