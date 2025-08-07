import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateCustomerForm, ValidationErrors } from '@/utils/validation';

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  serverValidation?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
  sanitizedData: any;
  isValidating?: boolean;
}

export const useFormValidation = (
  formType: 'customer' | 'transaction' | 'quote',
  options: UseFormValidationOptions = {}
) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: {},
    sanitizedData: {},
    isValidating: false
  });

  const validateForm = useCallback(async (data: any): Promise<ValidationResult> => {
    setValidationResult(prev => ({ ...prev, isValidating: true }));

    try {
      // Client-side validation first
      let clientValidation: ValidationResult;

      switch (formType) {
        case 'customer':
          clientValidation = validateCustomerForm(data);
          break;
        default:
          clientValidation = { isValid: true, errors: {}, sanitizedData: data };
      }

      // If client validation fails, return immediately
      if (!clientValidation.isValid) {
        const result = { ...clientValidation, isValidating: false };
        setValidationResult(result);
        return result;
      }

      // Server-side validation if enabled
      if (options.serverValidation) {
        try {
          const { data: serverResult, error } = await supabase.functions.invoke('validate-form-data', {
            body: {
              formType,
              data: clientValidation.sanitizedData
            }
          });

          if (error) {
            console.error('Server validation error:', error);
            // Fall back to client validation if server fails
            const result = { ...clientValidation, isValidating: false };
            setValidationResult(result);
            return result;
          }

          const result = { ...serverResult, isValidating: false };
          setValidationResult(result);
          return result;
        } catch (serverError) {
          console.error('Server validation failed:', serverError);
          // Fall back to client validation
          const result = { ...clientValidation, isValidating: false };
          setValidationResult(result);
          return result;
        }
      } else {
        const result = { ...clientValidation, isValidating: false };
        setValidationResult(result);
        return result;
      }
    } catch (error) {
      console.error('Form validation error:', error);
      const result = {
        isValid: false,
        errors: { general: 'Erro de validação' },
        sanitizedData: {},
        isValidating: false
      };
      setValidationResult(result);
      return result;
    }
  }, [formType, options.serverValidation]);

  const validateField = useCallback(async (fieldName: string, value: any) => {
    if (!options.validateOnChange && !options.validateOnBlur) return;

    const tempData = { [fieldName]: value };
    const result = await validateForm(tempData);

    // Only update the specific field error
    setValidationResult(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [fieldName]: result.errors[fieldName]
      }
    }));
  }, [validateForm, options.validateOnChange, options.validateOnBlur]);

  const clearFieldError = useCallback((fieldName: string) => {
    setValidationResult(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[fieldName];
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      };
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationResult(prev => ({
      ...prev,
      errors: {},
      isValid: true
    }));
  }, []);

  return {
    validateForm,
    validateField,
    clearFieldError,
    clearAllErrors,
    validationResult,
    isValidating: validationResult.isValidating
  };
};