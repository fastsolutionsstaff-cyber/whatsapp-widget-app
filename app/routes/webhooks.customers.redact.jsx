import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  try {
    // Shopify Remix template automatically handles HMAC verification
    const { shop, session, topic } = await authenticate.webhook(request);
    
    console.log(`✅ ${topic} webhook received for ${shop}`);
    
    // Get the customer data to redact
    const data = await request.json();
    console.log("Customer redact payload:", JSON.stringify(data, null, 2));
    
    // Delete any customer-related data from your database
    // Since this app doesn't store customer data, we just log it
    
    return new Response("OK", { status: 200 });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}