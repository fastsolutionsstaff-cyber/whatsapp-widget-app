import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop, admin } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // 1. Agar Scopes update ka webhook hai
  if (topic === "APP_SCOPES_UPDATE" && session) {
    const current = payload.current;
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  // 2. Agar Subscription update/payment ka webhook hai
  if (topic === "APP_SUBSCRIPTIONS_UPDATE") {
    // Check karein ke shop ka koi active pro subscription hai ya nahi
    const response = await admin.graphql(
      `#graphql
      query {
        currentAppInstallation {
          activeSubscriptions {
            name
            status
          }
        }
      }`
    );

    const data = await response.json();
    const subscriptions = data.data?.currentAppInstallation?.activeSubscriptions || [];
    
    // Agar active pro subscription mojood hai toh pro-plan kar do, warna starter-plan
    const hasActivePro = subscriptions.some(sub => sub.status === "ACTIVE");

    await db.storeSetting.updateMany({
      where: { shop: shop },
      data: { plan: hasActivePro ? "pro-plan" : "starter-plan" },
    });
  }

  return new Response();
};