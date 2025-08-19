-- Find and fix the remaining function with search path issue

-- Get all functions without proper search_path
SELECT 
    routine_name,
    routine_type,
    external_language
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_type = 'FUNCTION'
    AND routine_name NOT IN (
        'add_user_role', 
        'remove_user_role', 
        'send_notification',
        'calculate_product_margins',
        'is_admin'
    );

-- Fix validate_pipeline_stage function
CREATE OR REPLACE FUNCTION public.validate_pipeline_stage()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
begin
  -- probability 0..100
  if new.probability is null or new.probability < 0 or new.probability > 100 then
    raise exception 'probability must be between 0 and 100';
  end if;

  -- is_won e is_lost não podem ser ambos verdadeiros
  if coalesce(new.is_won, false) and coalesce(new.is_lost, false) then
    raise exception 'is_won and is_lost cannot both be true';
  end if;

  -- se is_won, probability = 100; se is_lost, probability = 0
  if coalesce(new.is_won, false) then
    new.probability := 100;
  elsif coalesce(new.is_lost, false) then
    new.probability := 0;
  end if;

  -- stage_key normalizado em minúsculas/slug simplificado
  if new.stage_key is not null then
    new.stage_key := lower(regexp_replace(new.stage_key, '[^a-z0-9_]+', '_', 'g'));
  end if;

  return new;
end;
$function$;