import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// WhatsApp webhook payload types
interface NotificationPayload {
  object: "whatsapp_business_account";
  entry: Entry[];
}

interface Entry {
  id: string;
  changes: Change[];
}

interface Change {
  field: string;
  value: {
    messaging_product: "whatsapp";
    messages?: Message[];
    contacts?: Contact[];
    metadata: { phone_number_id: string; display_phone_number: string };
  };
}

interface Contact {
  profile: { name: string };
  wa_id: string;
}

interface Message {
  from: string;
  id: string;
  type: "text" | "audio" | "image" | "interactive" | "button";
  text?: { body: string };
  timestamp: string;
}

// Function to create or update customer in CRM
async function createOrUpdateCustomer(supabase: any, phone: string, name: string, message: string) {
  try {
    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, name, phone, notes')
      .eq('phone', phone)
      .single();

    if (existingCustomer) {
      // Update existing customer with new interaction
      const updatedNotes = existingCustomer.notes 
        ? `${existingCustomer.notes}\n\n[WhatsApp ${new Date().toLocaleString('pt-BR')}]: ${message}`
        : `[WhatsApp ${new Date().toLocaleString('pt-BR')}]: ${message}`;
      
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          last_contact_date: new Date().toISOString(),
          notes: updatedNotes
        })
        .eq('id', existingCustomer.id);

      if (updateError) {
        console.error('Error updating customer:', updateError);
      }

      return existingCustomer.id;
    } else {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          name: name || `WhatsApp Contact ${cleanPhone}`,
          phone: phone,
          lead_source: 'whatsapp',
          status: 'prospecto',
          lifecycle_stage: 'lead',
          notes: `[WhatsApp ${new Date().toLocaleString('pt-BR')}]: ${message}`,
          last_contact_date: new Date().toISOString(),
          created_by: 'WhatsApp Bot'
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating customer:', createError);
        return null;
      }

      console.log('New customer created from WhatsApp:', newCustomer);
      return newCustomer?.id;
    }
  } catch (error) {
    console.error('Error in createOrUpdateCustomer:', error);
    return null;
  }
}

// Function to create customer interaction record
async function createCustomerInteraction(supabase: any, customerId: string, message: string, phone: string) {
  try {
    const { error } = await supabase
      .from('customer_interactions')
      .insert({
        customer_id: customerId,
        interaction_type: 'whatsapp',
        subject: 'Mensagem WhatsApp',
        description: message,
        outcome: 'received',
        created_by: 'WhatsApp Bot',
        date: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating interaction:', error);
    }
  } catch (error) {
    console.error('Error in createCustomerInteraction:', error);
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Validate environment variables
  const envVars = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), // Use service role for admin access
    WHATSAPP_VERIFY_TOKEN: Deno.env.get("WHATSAPP_VERIFY_TOKEN"),
    WHATSAPP_APP_SECRET: Deno.env.get("WHATSAPP_APP_SECRET"),
  };

  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.error(`Missing environment variable: ${key}`);
      return new Response(JSON.stringify({ error: `Missing ${key}` }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }

  const supabase = createClient(envVars.SUPABASE_URL!, envVars.SUPABASE_SERVICE_ROLE_KEY!);

  // Handle WhatsApp verification (GET request)
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const challenge = url.searchParams.get("hub.challenge");
    const token = url.searchParams.get("hub.verify_token");

    if (mode === "subscribe" && token === envVars.WHATSAPP_VERIFY_TOKEN) {
      console.log("WhatsApp webhook verified successfully");
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // Handle POST request (webhook payload)
  try {
    const body = await req.text();
    const signature = req.headers.get("x-hub-signature-256")?.replace("sha256=", "");

    // Verify webhook signature if app secret is provided
    if (envVars.WHATSAPP_APP_SECRET && signature) {
      const expectedSignature = createHmac("sha256", envVars.WHATSAPP_APP_SECRET!)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    const payload: NotificationPayload = JSON.parse(body);
    console.log("Webhook payload received:", JSON.stringify(payload, null, 2));

    // Process each entry and change
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        const messages = change.value.messages || [];
        const contacts = change.value.contacts || [];

        for (const message of messages) {
          const contact = contacts.find(c => c.wa_id === message.from);
          const contactName = contact?.profile?.name || "Contato WhatsApp";
          const messageText = message.type === "text" ? message.text?.body || "" : `[${message.type}]`;

          console.log(`Processing message from ${message.from}: ${messageText}`);

          // Check for duplicate message by message ID
          const { data: existing } = await supabase
            .from("whatsapp_messages")
            .select("id")
            .eq("whatsapp_message_id", message.id)
            .maybeSingle();

          if (existing) {
            console.log(`Duplicate message ID: ${message.id}`);
            continue;
          }

          // Create or update customer in CRM
          const customerId = await createOrUpdateCustomer(
            supabase, 
            message.from, 
            contactName, 
            messageText
          );

          // Insert WhatsApp message record
          const { error: messageError } = await supabase
            .from("whatsapp_messages")
            .insert({
              contact_name: contactName,
              message: messageText,
              whatsapp_message_id: message.id,
              phone_number: message.from,
              type: 'received',
              status: 'delivered',
              customer_id: customerId,
              received_at: new Date(parseInt(message.timestamp) * 1000).toISOString(),
            });

          if (messageError) {
            console.error("Error storing WhatsApp message:", messageError);
          }

          // Create customer interaction record if customer was created/found
          if (customerId) {
            await createCustomerInteraction(supabase, customerId, messageText, message.from);
          }

          console.log(`Message processed successfully for customer ID: ${customerId}`);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(JSON.stringify({ 
      error: "Processing failed", 
      message: err instanceof Error ? err.message : "Unknown error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});