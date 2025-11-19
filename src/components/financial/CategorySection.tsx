
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { revenueCategories, expenseCategories } from "@/constants/transactionCategories";

interface CategorySectionProps {
  type: 'receita' | 'despesa';
  category: string;
  subcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

export const CategorySection = ({ 
  type, 
  category, 
  subcategory, 
  onCategoryChange, 
  onSubcategoryChange 
}: CategorySectionProps) => {
  const categories = type === 'receita' ? revenueCategories : expenseCategories;
  const subcategories = category ? categories[category as keyof typeof categories] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category" className="label-readable">Categoria *</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="input-readable">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(categories).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {subcategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subcategory" className="label-readable">Subcategoria</Label>
          <Select value={subcategory} onValueChange={onSubcategoryChange}>
            <SelectTrigger className="input-readable">
              <SelectValue placeholder="Selecione a subcategoria" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
