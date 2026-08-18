import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, payload } = await authenticate.webhook(request);

    console.log(`✅ Compliance webhook received: ${topic} for shop: ${shop}`);

    switch (topic) {
      case "CUSTOMERS_DATA_REQUEST":
      case "customers/data_request": {
        console.log("Customer data request payload:", payload);
        break;
      }

      case "CUSTOMERS_REDACT":
      case "customers/redact": {
        console.log("Customer redact payload:", payload);
        break;
      }

      case "SHOP_REDACT":
      case "shop/redact": {
        if (shop) {
          await db.storeSetting.deleteMany({
            where: { shop },
          });
          console.log(`🗑️ All data deleted for shop: ${shop}`);
        }
        break;
      }

      default:
        console.warn(`Unhandled compliance topic: ${topic}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Compliance webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};