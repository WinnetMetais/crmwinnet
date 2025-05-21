
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Received OPTIONS request");
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log(`Received ${req.method} request to exchange Google auth code`);
    
    const requestBody = await req.json();
    const { code, redirectUri, clientId, clientSecret } = requestBody;

    console.log("Request received with the following parameters:");
    console.log(`- Redirect URI: ${redirectUri}`);
    console.log(`- Code length: ${code ? code.length : 0}`);
    console.log(`- Client ID present: ${!!clientId}`);
    console.log(`- Client Secret present: ${!!clientSecret}`);
    console.log(`- Request timestamp: ${new Date().toISOString()}`);
    console.log(`- Request URL: ${req.url}`); 
    console.log(`- Request headers: ${JSON.stringify(Object.fromEntries(req.headers))}`);

    // Validate required parameters
    if (!code || !redirectUri || !clientId || !clientSecret) {
      console.error("Missing required parameters");
      const missingParams = {
        code: !code ? "missing" : "provided", 
        redirectUri: !redirectUri ? "missing" : "provided", 
        clientId: !clientId ? "missing" : "provided", 
        clientSecret: !clientSecret ? "missing" : "provided"
      };
      
      console.error("Missing parameters details:", missingParams);
      
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameters", 
          details: missingParams,
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate code format (basic check)
    if (code.length < 10) {
      console.error("Invalid authorization code format");
      return new Response(
        JSON.stringify({ 
          error: "Invalid authorization code format", 
          details: "The authorization code appears to be too short or malformed",
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate redirect URI format (basic check)
    // Updated to check for ad-connect-config.lovable.app
    if (!redirectUri.startsWith("https://") || !redirectUri.includes("ad-connect-config.lovable.app")) {
      console.error("Invalid redirect URI format:", redirectUri);
      return new Response(
        JSON.stringify({ 
          error: "Invalid redirect URI format", 
          details: "The redirect URI must be a valid HTTPS URL from the ad-connect-config.lovable.app domain",
          uri_provided: redirectUri,
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log detailed info for debugging (don't log full code or secrets)
    console.log("Code length:", code.length);
    console.log("Client ID prefix:", clientId.substring(0, 5) + "...");
    console.log("Redirect URI:", redirectUri);
    console.log("Timestamp:", new Date().toISOString());

    // Prepare the token exchange request to Google OAuth 2.0 server
    const formData = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    console.log("Sending token exchange request to Google");
    console.log("Request URL: https://oauth2.googleapis.com/token");
    console.log("Request method: POST");
    console.log("Request timestamp:", new Date().toISOString());

    // Make the token exchange request
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    // Log response status
    console.log("Google API response status:", tokenResponse.status);
    console.log("Google API response status text:", tokenResponse.statusText);
    console.log("Response timestamp:", new Date().toISOString());

    // Parse the response
    const tokenData = await tokenResponse.json();

    // Check if the exchange was successful
    if (!tokenResponse.ok) {
      console.error("Google token exchange failed. Status:", tokenResponse.status);
      console.error("Error response:", JSON.stringify(tokenData));
      
      // More detailed error reporting
      const errorDetails = {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        google_error: tokenData,
        redirect_uri_used: redirectUri,
        timestamp: new Date().toISOString()
      };
      
      console.error("Complete error details:", JSON.stringify(errorDetails));
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to exchange code for token", 
          details: errorDetails,
          troubleshooting: "Verify that the client ID, client secret, and redirect URI match exactly with what's configured in Google Cloud Console.",
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Token exchange successful");
    console.log("Access token received (first 5 chars):", tokenData.access_token?.substring(0, 5) + "...");
    console.log("Token type:", tokenData.token_type);
    console.log("Expires in:", tokenData.expires_in);
    console.log("Refresh token received:", !!tokenData.refresh_token);
    console.log("Timestamp:", new Date().toISOString());

    // Return the token data
    return new Response(JSON.stringify(tokenData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in exchange-google-auth-code:", error);
    console.error("Error stack:", error.stack);
    console.error("Timestamp:", new Date().toISOString());
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        troubleshooting: "This appears to be a server-side error in the Edge Function. Check logs for more details."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
