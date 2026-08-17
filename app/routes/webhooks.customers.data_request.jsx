import { authenticate } from "../shopify.server";

export async function action({ request }) {
  try {
    // Shopify Remix template automatically handles HMAC verification
    const { shop, session, topic } = await authenticate.webhook(request);
    
    console.log(`✅ ${topic} webhook received for ${shop}`);
    
    // Log the data request
    const data = await request.json();
    console.log("Customer data request payload:", JSON.stringify(data, null, 2));
    
    // You can process the data request here
    // For this app, we don't store customer data, so we just acknowledge
    
    return new Response("OK", { status: 200 });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}