import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants for Google Auth - Updated to match Google Cloud Console
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
      clientIdLength: clientId.length,
      timestamp: new Date().toISOString()
    });
    
    // Validate inputs before sending to edge function
    if (!code || code.length < 10) {
      throw new Error("Código de autorização inválido ou muito curto");
    }
    
    if (!redirectUri || !redirectUri.includes("ad-connect-config.lovable.app")) {
      throw new Error(`URI de redirecionamento inválida: ${redirectUri}`);
    }
    
    if (!clientId || clientId.length < 20) {
      throw new Error("Client ID inválido ou muito curto");
    }
    
    if (!clientSecret || clientSecret.length < 10) {
      throw new Error("Client Secret inválido ou muito curto");
    }
    
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
      
      // Mensagens de erro mais amigáveis baseadas em erros comuns
      if (data.error.error === "invalid_grant") {
        throw new Error("Código de autorização inválido ou expirado. Tente conectar novamente.");
      } else if (data.error.error === "invalid_client") {
        throw new Error("Client ID ou Client Secret inválidos. Verifique as credenciais.");
      } else if (data.error.error === "redirect_uri_mismatch") {
        throw new Error("URI de redirecionamento não corresponde ao configurado no Google Cloud Console.");
      } else {
        throw new Error(`Erro do Google: ${data.error.error_description || data.error.error || JSON.stringify(data.error)}`);
      }
    }
    
    if (data.access_token) {
      console.log("Troca de token bem-sucedida", {
        tokenLength: data.access_token.length,
        expiresIn: data.expires_in,
        hasRefreshToken: !!data.refresh_token,
        timestamp: new Date().toISOString()
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
  
  if (!googleRedirectUri || !googleRedirectUri.includes("ad-connect-config.lovable.app")) {
    toast.error("URI de redirecionamento inválida");
    return;
  }

  // Validação adicional
  if (googleClientId.length < 20) {
    toast.error("Client ID parece ser inválido");
    return;
  }

  // Logging do início da autenticação
  console.log("Iniciando autenticação com Google", {
    redirectUri: googleRedirectUri,
    clientIdLength: googleClientId.length,
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

  // Exibir toast antes do redirecionamento
  toast.info("Redirecionando para autenticação do Google...");
  
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
      hasLinkedinToken: !!newTokens.linkedinAdsToken,
      timestamp: new Date().toISOString()
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
        hasLinkedinToken: !!tokens.linkedinAdsToken,
        timestamp: new Date().toISOString()
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

/**
 * Clears a specific platform token
 * @param platform The platform to clear token for
 */
export const clearPlatformToken = (platform: 'google' | 'facebook' | 'linkedin') => {
  try {
    const savedTokens = localStorage.getItem('adTokens');
    if (!savedTokens) return;
    
    const tokens = JSON.parse(savedTokens);
    
    if (platform === 'google') {
      delete tokens.googleAdsToken;
    } else if (platform === 'facebook') {
      delete tokens.facebookAdsToken;
    } else if (platform === 'linkedin') {
      delete tokens.linkedinAdsToken;
    }
    
    localStorage.setItem('adTokens', JSON.stringify(tokens));
    console.log(`Token de ${platform} removido com sucesso`);
    
  } catch (error) {
    console.error(`Erro ao remover token de ${platform}:`, error);
  }
};
