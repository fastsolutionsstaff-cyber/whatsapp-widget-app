import { authenticate } from "../shopify.server";
import db from "../db.server";

export async function action({ request }) {
  try {
    const { shop, topic } = await authenticate.webhook(request);
    console.log(`✅ Compliance webhook received: ${topic} for shop: ${shop}`);

    const payload = await request.json();

    switch (topic) {
      case "customers/data_request":
        // Handle customer personal data requests here
        console.log("Customer data request payload:", payload);
        break;

      case "customers/redact":
        // Handle customer data erasure requests here
        console.log("Customer redact payload:", payload);
        break;

      case "shop/redact":
        // Handle shop data deletion (e.g., clearing store settings from database)
        await db.storeSetting.deleteMany({
          where: { shop },
        });
        console.log(`🗑️ All data deleted for shop: ${shop}`);
        break;

      default:
        console.warn(`Unhandled compliance webhook topic: ${topic}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Compliance webhook validation error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}