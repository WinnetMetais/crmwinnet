-- Fase 1: Corrigir estrutura do banco de dados para profiles e departments

-- 1. Adicionar coluna department_id (UUID) à tabela profiles
ALTER TABLE public.profiles ADD COLUMN department_id UUID;

-- 2. Criar foreign key entre profiles.department_id e departments.id
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;

-- 3. Tentar migrar dados existentes do campo department (texto) para department_id (UUID)
-- Atualizar department_id baseado no nome do department quando possível
UPDATE public.profiles 
SET department_id = d.id 
FROM public.departments d 
WHERE profiles.department = d.name AND profiles.department IS NOT NULL;

-- 4. Remover a coluna department antiga (texto) se existir
ALTER TABLE public.profiles DROP COLUMN IF EXISTS department;