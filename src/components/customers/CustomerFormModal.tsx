
import React from 'react';
import { CustomerForm } from './CustomerForm';
import { CustomerFormData } from '@/types/customer';

interface CustomerFormModalProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
  initialData?: Partial<CustomerFormData>;
}

export const CustomerFormModal = ({ onSubmit, onCancel, mode = 'create', initialData }: CustomerFormModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CustomerForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          mode={mode}
          initialData={initialData}
        />
      </div>
    </div>
  );
};
