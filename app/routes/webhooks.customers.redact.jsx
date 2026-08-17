import { authenticate } from "../shopify.server";

export async function action({ request }) {
  try {
    const { shop, topic } = await authenticate.webhook(request);

    console.log(`✅ ${topic} webhook received for ${shop}`);

    const data = await request.json();

    console.log(
      "Customer redact payload:",
      JSON.stringify(data, null, 2)
    );

    // This app does not store customer data.
    // Therefore, there is no customer data to delete.

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);

    return new Response("Unauthorized", { status: 401 });
  }
}