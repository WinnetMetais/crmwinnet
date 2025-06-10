
-- Limpar segmentos existentes e inserir os novos
DELETE FROM public.customer_segments;

-- Inserir novos segmentos conforme especificado
INSERT INTO public.customer_segments (name, description) VALUES
('Escola/Faculdade', 'Instituições de ensino'),
('Hospital', 'Hospitais e centros médicos'),
('Clinica', 'Clínicas médicas e odontológicas'),
('Revenda', 'Empresas revendedoras'),
('Cliente CPF', 'Pessoa física'),
('Hotel/Resort', 'Hotéis, resorts e pousadas'),
('Clube', 'Clubes sociais e esportivos'),
('Industria', 'Empresas industriais'),
('Centro Comercial', 'Shopping centers e galerias'),
('Ecommerce', 'Lojas virtuais e marketplace'),
('Condominio', 'Condomínios residenciais e comerciais'),
('Licitação', 'Processos licitatórios');
