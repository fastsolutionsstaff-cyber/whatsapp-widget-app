import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { shop, topic } = await authenticate.webhook(request);
    console.log(`✅ ${topic} webhook received for ${shop}`);

    if (shop) {
      await db.storeSetting.deleteMany({
        where: { shop },
      });
      console.log(`🗑️ All data deleted for shop: ${shop}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Shop redact webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};