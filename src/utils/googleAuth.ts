
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const exchangeGoogleAuthCode = async (
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('exchange-google-auth-code', {
      body: { 
        code,
        redirectUri,
        clientId,
        clientSecret
      }
    });
    
    if (error) throw error;
    
    if (data && data.access_token) {
      return data.access_token;
    } else {
      throw new Error("Resposta inválida da API");
    }
  } catch (error: any) {
    console.error("Erro na autenticação Google:", error);
    throw error;
  }
};

export const initiateGoogleAuth = (
  googleClientId: string,
  googleRedirectUri: string
) => {
  if (!googleClientId) {
    toast.error("O Client ID é necessário para autenticação");
    return;
  }

  // Google OAuth configuration
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', googleClientId);
  authUrl.searchParams.append('redirect_uri', googleRedirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');

  // Redirect to Google's auth page
  window.location.href = authUrl.toString();
};
