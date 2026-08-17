import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  // This verifies the request is genuinely from Shopify (checks the HMAC
  // signature for you) and tells us which topic and shop it's for.
  const { topic, shop } = await authenticate.webhook(request);

  switch (topic) {
    case "customers/data_request":
      // A customer asked what data you have on them. Your app doesn't
      // store personal customer data (no customer/order scopes requested),
      // so there's nothing to provide — just acknowledge it.
      console.log(`Data request received for shop: ${shop}`);
      break;

    case "customers/redact":
      // A customer asked for their data to be deleted. Same as above —
      // nothing personal is stored, so nothing to delete.
      console.log(`Customer redact request for shop: ${shop}`);
      break;

    case "shop/redact":
      // The shop uninstalled the app 48 hours ago. Delete anything tied
      // to that shop — this is your actual StoreSetting row.
      await prisma.storeSetting.deleteMany({ where: { shop } });
      console.log(`Shop redact — deleted data for: ${shop}`);
      break;

    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }

  return new Response();
};
