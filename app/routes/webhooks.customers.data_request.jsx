import { authenticate } from "../shopify.server";

export async function action({ request }) {
  try {
    const { shop, topic, payload } = await authenticate.webhook(request);
    console.log(`✅ ${topic} webhook received for ${shop}`, payload);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}