import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop } = await authenticate.webhook(request);

    console.log(`Received compliance webhook ${topic} for shop ${shop}`);

    switch (topic) {
      case "CUSTOMERS_DATA_REQUEST":
      case "customers/data_request":
        console.log(`Data request received for shop: ${shop}`);
        break;

      case "CUSTOMERS_REDACT":
      case "customers/redact":
        console.log(`Customer redact request for shop: ${shop}`);
        break;

      case "SHOP_REDACT":
      case "shop/redact":
        if (shop) {
          await db.storeSetting.deleteMany({ where: { shop } });
        }
        break;

      default:
        console.log(`Unhandled privacy topic: ${topic}`);
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Compliance webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};