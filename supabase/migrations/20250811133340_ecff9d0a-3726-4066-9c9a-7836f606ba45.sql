-- Corrigir avisos: definir search_path em funções sem parâmetro configurado
ALTER FUNCTION public.validate_pipeline_stage()
  SET search_path = 'public';

ALTER FUNCTION public.update_updated_at_column()
  SET search_path = 'public';
