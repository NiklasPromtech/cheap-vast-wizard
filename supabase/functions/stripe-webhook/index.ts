import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not set");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.user_id;
      const impressions = parseInt(session.metadata?.impressions || "0");
      
      if (!userId || !impressions) {
        console.error("Missing metadata:", { userId, impressions });
        return new Response("Missing metadata", { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Add impressions to user profile
      const { error: updateError } = await supabase.rpc("increment_credits", {
        user_id: userId,
        amount: impressions,
      });

      if (updateError) {
        // Fallback to direct update if RPC doesn't exist
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("user_id", userId)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ credits: profile.credits + impressions })
            .eq("user_id", userId);
        }
      }

      // Log transaction
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: impressions,
        type: "purchase",
        stripe_payment_intent_id: session.payment_intent as string,
        description: `Purchased ${impressions.toLocaleString()} impressions for $${(impressions / 100).toFixed(2)}`,
      });

      console.log(`Added ${impressions} impressions to user ${userId}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
