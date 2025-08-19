-- Fix function search path by dropping and recreating properly

-- Drop and recreate functions with proper search_path
DROP FUNCTION IF EXISTS public.remove_user_role(uuid, text);
DROP FUNCTION IF EXISTS public.add_user_role(uuid, text);
DROP FUNCTION IF EXISTS public.send_notification(uuid, text, text, text, text, jsonb);

CREATE OR REPLACE FUNCTION public.add_user_role(p_user_id uuid, p_role text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    INSERT INTO user_roles (user_id, roles)
    VALUES (p_user_id, ARRAY[p_role])
    ON CONFLICT (user_id) DO UPDATE 
    SET 
        roles = array_append(
            array_remove(user_roles.roles, p_role), 
            p_role
        ),
        updated_at = NOW();
END;
$function$;

CREATE OR REPLACE FUNCTION public.remove_user_role(p_user_id uuid, p_role text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    UPDATE user_roles
    SET 
        roles = array_remove(roles, p_role),
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.send_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_action_url text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
  VALUES (p_user_id, p_title, p_message, p_type, p_action_url, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;