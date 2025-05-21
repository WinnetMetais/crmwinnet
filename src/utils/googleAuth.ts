
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants for Google Auth
const APP_URL = "https://ad-connect-config.lovable.app";

/**
 * Exchanges a Google auth code for an access token
 * @param code Authorization code received from Google
 * @param redirectUri Redirect URI that was used to get the code
 * @param clientId Google client ID
 * @param clientSecret Google client secret
 * @returns Access token
 */
export const exchangeGoogleAuthCode = async (
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string
) => {
  try {
    console.log("Enviando código para troca por token via Edge Function", {
      codeLength: code.length,
      redirectUri,
      timestamp: new Date().toISOString()
    });
    
    const { data, error } = await supabase.functions.invoke('exchange-google-auth-code', {
      body: { 
        code,
        redirectUri,
        clientId,
        clientSecret
      }
    });
    
    if (error) {
      console.error("Erro na Edge Function:", error);
      throw new Error(`Erro na Edge Function: ${error.message || JSON.stringify(error)}`);
    }
    
    if (!data) {
      console.error("Resposta vazia da API");
      throw new Error("Resposta vazia da API");
    }
    
    if (data.error) {
      console.error("Erro retornado pela API do Google:", data.error);
      throw new Error(`Erro do Google: ${data.error.message || JSON.stringify(data.error)}`);
    }
    
    if (data.access_token) {
      console.log("Troca de token bem-sucedida", {
        tokenLength: data.access_token.length,
        expiresIn: data.expires_in,
        hasRefreshToken: !!data.refresh_token
      });
      return data.access_token;
    } else {
      console.error("Token não encontrado na resposta:", data);
      throw new Error("Token não encontrado na resposta da API");
    }
  } catch (error: any) {
    console.error("Erro completo na autenticação Google:", error);
    
    // Mensagem de erro mais amigável e detalhada
    const errorMessage = error.message || "Erro desconhecido na autenticação";
    throw new Error(`Falha na autenticação: ${errorMessage}`);
  }
};

/**
 * Initiates Google OAuth flow
 * @param googleClientId Google client ID
 * @param googleRedirectUri Redirect URI after authentication
 */
export const initiateGoogleAuth = (
  googleClientId: string,
  googleRedirectUri: string
) => {
  if (!googleClientId) {
    toast.error("O Client ID é necessário para autenticação");
    return;
  }

  // Logging do início da autenticação
  console.log("Iniciando autenticação com Google", {
    redirectUri: googleRedirectUri,
    timestamp: new Date().toISOString()
  });

  // Google OAuth configuration
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', googleClientId);
  authUrl.searchParams.append('redirect_uri', googleRedirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  
  const finalUrl = authUrl.toString();
  console.log("URL de autenticação Google completa:", finalUrl);

  // Redirect to Google's auth page
  window.location.href = finalUrl;
};

/**
 * Saves ad platform tokens to localStorage
 * @param tokens Object containing tokens for different ad platforms
 */
export const saveAdPlatformTokens = (tokens: {
  googleAdsToken?: string;
  facebookAdsToken?: string;
  linkedinAdsToken?: string;
}) => {
  try {
    const savedTokens = localStorage.getItem('adTokens');
    const currentTokens = savedTokens ? JSON.parse(savedTokens) : {};
    
    const newTokens = {
      ...currentTokens,
      ...tokens
    };
    
    localStorage.setItem('adTokens', JSON.stringify(newTokens));
    
    console.log("Tokens salvos com sucesso", {
      hasGoogleToken: !!newTokens.googleAdsToken,
      hasFacebookToken: !!newTokens.facebookAdsToken,
      hasLinkedinToken: !!newTokens.linkedinAdsToken
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar tokens:", error);
    return false;
  }
};

/**
 * Loads ad platform tokens from localStorage
 * @returns Object containing tokens for different ad platforms
 */
export const loadAdPlatformTokens = () => {
  try {
    const savedTokens = localStorage.getItem('adTokens');
    if (savedTokens) {
      const tokens = JSON.parse(savedTokens);
      console.log("Tokens carregados com sucesso", {
        hasGoogleToken: !!tokens.googleAdsToken,
        hasFacebookToken: !!tokens.facebookAdsToken,
        hasLinkedinToken: !!tokens.linkedinAdsToken
      });
      return tokens;
    }
    console.log("Nenhum token salvo encontrado");
    return {};
  } catch (error) {
    console.error("Erro ao carregar tokens salvos:", error);
    return {};
  }
};

/**
 * Validates if a token exists and appears to be valid
 * @param token The token to validate
 * @returns Boolean indicating if token appears valid
 */
export const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;
  
  // Basic validation - check if token has reasonable length and format
  // Real validation would require calling the API
  return token.length > 20;
};
