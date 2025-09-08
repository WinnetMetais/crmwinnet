-- Corrigir estrutura do banco de dados de forma mais segura

-- 1. Adicionar coluna department_id (UUID) à tabela profiles se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'department_id' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN department_id UUID;
    END IF;
END $$;

-- 2. Criar foreign key entre profiles.department_id e departments.id se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_profiles_department' 
                   AND table_name = 'profiles' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT fk_profiles_department 
        FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Migrar dados existentes do campo department (texto) para department_id (UUID)
UPDATE public.profiles 
SET department_id = d.id 
FROM public.departments d 
WHERE profiles.department = d.name 
  AND profiles.department IS NOT NULL 
  AND profiles.department_id IS NULL;