import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  try {
    // Shopify Remix template automatically handles HMAC verification
    const { shop, session, topic } = await authenticate.webhook(request);
    
    console.log(`✅ ${topic} webhook received for ${shop}`);
    
    // Delete all shop data from your database
    await prisma.storeSetting.deleteMany({
      where: { shop },
    });
    
    console.log(`🗑️ All data deleted for shop: ${shop}`);
    
    return new Response("OK", { status: 200 });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}