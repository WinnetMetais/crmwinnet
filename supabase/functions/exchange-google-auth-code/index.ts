
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
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { code, redirectUri, clientId, clientSecret } = await req.json();

    console.log("Exchange code for token request received");
    console.log("Redirect URI:", redirectUri);

    // Validate required parameters
    if (!code || !redirectUri || !clientId || !clientSecret) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameters", 
          details: { 
            code: !code ? "missing" : "provided", 
            redirectUri: !redirectUri ? "missing" : "provided", 
            clientId: !clientId ? "missing" : "provided", 
            clientSecret: !clientSecret ? "missing" : "provided" 
          }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare the token exchange request to Google OAuth 2.0 server
    const formData = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    console.log("Sending token exchange request to Google");

    // Make the token exchange request
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    // Parse the response
    const tokenData = await tokenResponse.json();

    // Check if the exchange was successful
    if (!tokenResponse.ok) {
      console.error("Google token exchange failed:", tokenData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to exchange code for token", 
          google_error: tokenData 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Token exchange successful");

    // Return the token data
    return new Response(JSON.stringify(tokenData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in exchange-google-auth-code:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
