import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// XSS Protection utility
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>\"'&]/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    })
    .trim();
};

// Server-side validation functions
const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) return { isValid: true };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitizedEmail = sanitizeInput(email.toLowerCase());
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email muito longo' };
  }
  
  return { isValid: true };
};

const validateBrazilianPhone = (phone: string): { isValid: boolean; cleanPhone: string; error?: string } => {
  if (!phone) return { isValid: true, cleanPhone: '' };

  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10 || cleanPhone.length > 13) {
    return { 
      isValid: false, 
      cleanPhone: '', 
      error: 'Telefone deve ter entre 10 e 13 dígitos' 
    };
  }

  // Valid Brazilian area codes
  const validAreaCodes = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38',
    '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69',
    '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89',
    '91', '92', '93', '94', '95', '96', '97', '98', '99'
  ];

  if (cleanPhone.length >= 10) {
    const areaCode = cleanPhone.substring(0, 2);
    if (!validAreaCodes.includes(areaCode)) {
      return { isValid: false, cleanPhone: '', error: 'Código de área inválido' };
    }
  }

  return { isValid: true, cleanPhone };
};

const validateCNPJ = (cnpj: string): { isValid: boolean; error?: string } => {
  if (!cnpj) return { isValid: true };

  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    return { isValid: false, error: 'CNPJ deve ter 14 dígitos' };
  }

  // Check for known invalid CNPJs
  const invalidCNPJs = [
    '00000000000000', '11111111111111', '22222222222222', '33333333333333',
    '44444444444444', '55555555555555', '66666666666666', '77777777777777',
    '88888888888888', '99999999999999'
  ];

  if (invalidCNPJs.includes(cleanCNPJ)) {
    return { isValid: false, error: 'CNPJ inválido' };
  }

  // CNPJ validation algorithm
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calculateDigit = (digits: string, weights: number[]): number => {
    const sum = digits
      .split('')
      .reduce((acc, digit, index) => acc + parseInt(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cleanCNPJ.substring(0, 12), weights1);
  const secondDigit = calculateDigit(cleanCNPJ.substring(0, 13), weights2);

  const isValid = 
    parseInt(cleanCNPJ[12]) === firstDigit && 
    parseInt(cleanCNPJ[13]) === secondDigit;

  return { 
    isValid, 
    error: isValid ? undefined : 'CNPJ inválido' 
  };
};

const validateText = (
  text: string, 
  fieldName: string, 
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  } = {}
): { isValid: boolean; sanitizedText: string; error?: string } => {
  const { required = false, minLength = 0, maxLength = 1000 } = options;
  
  if (!text && required) {
    return { 
      isValid: false, 
      sanitizedText: '', 
      error: `${fieldName} é obrigatório` 
    };
  }

  if (!text) {
    return { isValid: true, sanitizedText: '' };
  }

  const sanitizedText = sanitizeInput(text);

  if (sanitizedText.length < minLength) {
    return {
      isValid: false,
      sanitizedText,
      error: `${fieldName} deve ter pelo menos ${minLength} caracteres`
    };
  }

  if (sanitizedText.length > maxLength) {
    return {
      isValid: false,
      sanitizedText,
      error: `${fieldName} deve ter no máximo ${maxLength} caracteres`
    };
  }

  return { isValid: true, sanitizedText };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { formType, data } = body;

    if (!formType || !data) {
      return new Response(
        JSON.stringify({ error: "Missing formType or data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let validationResult;

    switch (formType) {
      case 'customer':
        validationResult = await validateCustomerData(data);
        break;
      case 'transaction':
        validationResult = await validateTransactionData(data);
        break;
      case 'quote':
        validationResult = await validateQuoteData(data);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid form type" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }

    return new Response(
      JSON.stringify(validationResult),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal validation error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

async function validateCustomerData(data: any) {
  const errors: { [key: string]: string } = {};
  const sanitizedData: any = {};

  // Validate name (required)
  const nameValidation = validateText(data.name, 'Nome', { 
    required: true, 
    minLength: 2, 
    maxLength: 255 
  });
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  sanitizedData.name = nameValidation.sanitizedText;

  // Validate email
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
    sanitizedData.email = sanitizeInput(data.email);
  }

  // Validate phone
  if (data.phone) {
    const phoneValidation = validateBrazilianPhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }
    sanitizedData.phone = phoneValidation.cleanPhone;
  }

  // Validate CNPJ
  if (data.cnpj) {
    const cnpjValidation = validateCNPJ(data.cnpj);
    if (!cnpjValidation.isValid) {
      errors.cnpj = cnpjValidation.error!;
    }
    sanitizedData.cnpj = data.cnpj.replace(/\D/g, '');
  }

  // Validate other text fields
  const textFields = ['company', 'address', 'city', 'contact_person', 'lead_source', 'notes'];
  textFields.forEach(field => {
    if (data[field]) {
      const validation = validateText(data[field], field, { maxLength: 1000 });
      if (!validation.isValid) {
        errors[field] = validation.error!;
      }
      sanitizedData[field] = validation.sanitizedText;
    }
  });

  // Validate status
  const validStatuses = ['active', 'inactive', 'prospect', 'qualified', 'customer'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = 'Status inválido';
  }
  sanitizedData.status = data.status;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
    score: calculateDataQualityScore(sanitizedData)
  };
}

async function validateTransactionData(data: any) {
  const errors: { [key: string]: string } = {};
  const sanitizedData: any = {};

  // Validate amount (required)
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Valor deve ser maior que zero';
  }
  sanitizedData.amount = data.amount;

  // Validate title (required)
  const titleValidation = validateText(data.title, 'Título', { 
    required: true, 
    minLength: 3, 
    maxLength: 255 
  });
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error!;
  }
  sanitizedData.title = titleValidation.sanitizedText;

  // Validate category (required)
  if (!data.category) {
    errors.category = 'Categoria é obrigatória';
  }
  sanitizedData.category = sanitizeInput(data.category);

  // Validate type
  const validTypes = ['receita', 'despesa'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = 'Tipo inválido';
  }
  sanitizedData.type = data.type;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
    score: calculateDataQualityScore(sanitizedData)
  };
}

async function validateQuoteData(data: any) {
  const errors: { [key: string]: string } = {};
  const sanitizedData: any = {};

  // Validate quote number (required)
  const quoteNumberValidation = validateText(data.quoteNumber, 'Número do Orçamento', { 
    required: true, 
    minLength: 1, 
    maxLength: 50 
  });
  if (!quoteNumberValidation.isValid) {
    errors.quoteNumber = quoteNumberValidation.error!;
  }
  sanitizedData.quoteNumber = quoteNumberValidation.sanitizedText;

  // Validate customer name (required)
  const customerNameValidation = validateText(data.customerName, 'Nome do Cliente', { 
    required: true, 
    minLength: 2, 
    maxLength: 255 
  });
  if (!customerNameValidation.isValid) {
    errors.customerName = customerNameValidation.error!;
  }
  sanitizedData.customerName = customerNameValidation.sanitizedText;

  // Validate total (required)
  if (!data.total || data.total <= 0) {
    errors.total = 'Total deve ser maior que zero';
  }
  sanitizedData.total = data.total;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
    score: calculateDataQualityScore(sanitizedData)
  };
}

function calculateDataQualityScore(data: any): number {
  let score = 0;
  const totalFields = Object.keys(data).length;
  const filledFields = Object.values(data).filter(value => value !== null && value !== undefined && value !== '').length;
  
  if (totalFields > 0) {
    score = (filledFields / totalFields) * 100;
  }
  
  return Math.round(score);
}

serve(handler);