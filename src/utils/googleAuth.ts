
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
    console.log("Sending code to exchange for token to edge function", {
      code: code.substring(0, 10) + "...",
      redirectUri
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
      console.error("Edge function error:", error);
      throw error;
    }
    
    if (data && data.access_token) {
      console.log("Token exchange successful");
      return data.access_token;
    } else {
      console.error("Invalid API response:", data);
      throw new Error("Resposta inválida da API");
    }
  } catch (error: any) {
    console.error("Erro na autenticação Google:", error);
    throw error;
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

  // Google OAuth configuration
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', googleClientId);
  authUrl.searchParams.append('redirect_uri', googleRedirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  
  console.log("Redirecting to Google auth:", authUrl.toString());

  // Redirect to Google's auth page
  window.location.href = authUrl.toString();
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
      return JSON.parse(savedTokens);
    }
    return {};
  } catch (error) {
    console.error("Erro ao carregar tokens salvos:", error);
    return {};
  }
};
