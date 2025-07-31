import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppMessageRequest {
  phone: string;
  message: string;
  customerName: string;
  type?: 'quote' | 'follow_up' | 'custom';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, customerName, type = 'custom' }: WhatsAppMessageRequest = await req.json();

    // Validate required fields
    if (!phone || !message || !customerName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, message, customerName" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Clean phone number (remove non-numeric characters)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Validate Brazilian phone number format
    if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format phone number for WhatsApp API (add 55 country code if not present)
    let formattedPhone = cleanPhone;
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    // Here you would integrate with WhatsApp Business API
    // For now, we'll simulate the API call
    
    // Example using WhatsApp Business API (commented out - requires API setup)
    /*
    const whatsappApiUrl = `https://graph.facebook.com/v17.0/${Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")}/messages`;
    const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    
    const whatsappResponse = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message
        }
      })
    });

    if (!whatsappResponse.ok) {
      throw new Error(`WhatsApp API error: ${whatsappResponse.statusText}`);
    }

    const whatsappData = await whatsappResponse.json();
    */

    // Simulated response for development
    const simulatedResponse = {
      success: true,
      messageId: `msg_${Date.now()}`,
      phone: formattedPhone,
      status: 'sent',
      timestamp: new Date().toISOString()
    };

    // Log the message attempt
    console.log("WhatsApp message sent:", {
      to: formattedPhone,
      customerName,
      type,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you would also:
    // 1. Store the message in your database
    // 2. Handle webhooks for delivery status
    // 3. Implement retry logic for failed messages
    // 4. Add rate limiting and message quotas

    return new Response(JSON.stringify(simulatedResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-whatsapp-message function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send WhatsApp message"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);