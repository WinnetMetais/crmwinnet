// Comprehensive server-side validation utilities
import DOMPurify from 'isomorphic-dompurify';

// XSS Protection utility
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

// Phone number validation for Brazilian format
export const validateBrazilianPhone = (phone: string): { isValid: boolean; cleanPhone: string; error?: string } => {
  if (!phone) {
    return { isValid: false, cleanPhone: '', error: 'Telefone é obrigatório' };
  }

  const cleanPhone = phone.replace(/\D/g, '');
  
  // Brazilian phone number formats:
  // Landline: 11 digits (with area code) or 10 digits (old format)
  // Mobile: 11 digits (9 at start) or 13 digits (with country code 55)
  if (cleanPhone.length < 10 || cleanPhone.length > 13) {
    return { 
      isValid: false, 
      cleanPhone: '', 
      error: 'Telefone deve ter entre 10 e 13 dígitos' 
    };
  }

  // Check if it's a valid Brazilian mobile or landline
  if (cleanPhone.length === 11) {
    const areaCode = cleanPhone.substring(0, 2);
    const number = cleanPhone.substring(2);
    
    // Valid area codes in Brazil (11-99)
    const validAreaCodes = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
      '21', '22', '24', // RJ
      '27', '28', // ES
      '31', '32', '33', '34', '35', '37', '38', // MG
      '41', '42', '43', '44', '45', '46', // PR
      '47', '48', '49', // SC
      '51', '53', '54', '55', // RS
      '61', // DF
      '62', '64', // GO
      '63', // TO
      '65', '66', // MT
      '67', // MS
      '68', // AC
      '69', // RO
      '71', '73', '74', '75', '77', // BA
      '79', // SE
      '81', '87', // PE
      '82', // AL
      '83', // PB
      '84', // RN
      '85', '88', // CE
      '86', '89', // PI
      '91', '93', '94', // PA
      '92', '97', // AM
      '95', // RR
      '96', // AP
      '98', '99' // MA
    ];

    if (!validAreaCodes.includes(areaCode)) {
      return {
        isValid: false,
        cleanPhone: '',
        error: 'Código de área inválido'
      };
    }

    // Mobile numbers start with 9
    if (number.length === 9 && number.startsWith('9')) {
      return { isValid: true, cleanPhone };
    }
    
    // Landline numbers are 8 digits
    if (number.length === 8) {
      return { isValid: true, cleanPhone };
    }
  }

  // With country code (55)
  if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    const withoutCountry = cleanPhone.substring(2);
    return validateBrazilianPhone(withoutCountry);
  }

  return {
    isValid: false,
    cleanPhone: '',
    error: 'Formato de telefone inválido'
  };
};

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

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

// CNPJ validation
export const validateCNPJ = (cnpj: string): { isValid: boolean; error?: string } => {
  if (!cnpj) return { isValid: true }; // CNPJ is optional

  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    return { isValid: false, error: 'CNPJ deve ter 14 dígitos' };
  }

  // Check for known invalid CNPJs
  const invalidCNPJs = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999'
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

// General text validation with XSS protection
export const validateText = (
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

// URL validation
export const validateURL = (url: string): { isValid: boolean; sanitizedURL: string; error?: string } => {
  if (!url) return { isValid: true, sanitizedURL: '' };

  const sanitizedURL = sanitizeInput(url);
  
  try {
    // Add protocol if missing
    const urlToTest = sanitizedURL.startsWith('http') ? sanitizedURL : `https://${sanitizedURL}`;
    new URL(urlToTest);
    
    return { isValid: true, sanitizedURL: urlToTest };
  } catch {
    return { 
      isValid: false, 
      sanitizedURL, 
      error: 'URL inválida' 
    };
  }
};

// CEP validation (Brazilian postal code)
export const validateCEP = (cep: string): { isValid: boolean; error?: string } => {
  if (!cep) return { isValid: true }; // CEP is optional

  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    return { isValid: false, error: 'CEP deve ter 8 dígitos' };
  }

  return { isValid: true };
};

// Comprehensive form validation
export interface ValidationErrors {
  [field: string]: string;
}

export const validateCustomerForm = (formData: any): { isValid: boolean; errors: ValidationErrors; sanitizedData: any } => {
  const errors: ValidationErrors = {};
  const sanitizedData: any = {};

  // Validate name (required)
  const nameValidation = validateText(formData.name, 'Nome', { 
    required: true, 
    minLength: 2, 
    maxLength: 255 
  });
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  sanitizedData.name = nameValidation.sanitizedText;

  // Validate email
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
    sanitizedData.email = sanitizeInput(formData.email);
  }

  // Validate phone
  if (formData.phone) {
    const phoneValidation = validateBrazilianPhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }
    sanitizedData.phone = phoneValidation.cleanPhone;
  }

  // Validate CNPJ
  if (formData.cnpj) {
    const cnpjValidation = validateCNPJ(formData.cnpj);
    if (!cnpjValidation.isValid) {
      errors.cnpj = cnpjValidation.error!;
    }
    sanitizedData.cnpj = formData.cnpj.replace(/\D/g, '');
  }

  // Validate other text fields
  const textFields = ['company', 'address', 'city', 'contact_person', 'lead_source', 'notes'];
  textFields.forEach(field => {
    if (formData[field]) {
      const validation = validateText(formData[field], field, { maxLength: 1000 });
      if (!validation.isValid) {
        errors[field] = validation.error!;
      }
      sanitizedData[field] = validation.sanitizedText;
    }
  });

  // Validate state (UF)
  if (formData.state) {
    const stateValidation = validateText(formData.state, 'Estado', { maxLength: 2 });
    if (!stateValidation.isValid) {
      errors.state = stateValidation.error!;
    }
    sanitizedData.state = stateValidation.sanitizedText.toUpperCase();
  }

  // Validate CEP
  if (formData.zip_code) {
    const cepValidation = validateCEP(formData.zip_code);
    if (!cepValidation.isValid) {
      errors.zip_code = cepValidation.error!;
    }
    sanitizedData.zip_code = formData.zip_code.replace(/\D/g, '');
  }

  // Validate website
  if (formData.website) {
    const urlValidation = validateURL(formData.website);
    if (!urlValidation.isValid) {
      errors.website = urlValidation.error!;
    }
    sanitizedData.website = urlValidation.sanitizedURL;
  }

  // Validate status
  const validStatuses = ['active', 'inactive', 'prospect', 'qualified', 'customer'];
  if (formData.status && !validStatuses.includes(formData.status)) {
    errors.status = 'Status inválido';
  }
  sanitizedData.status = formData.status;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};