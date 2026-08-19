import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, admin } = await authenticate.webhook(request);

    if (topic === "APP_SUBSCRIPTIONS_UPDATE" || topic === "app/subscriptions_update") {
      if (admin) {
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
        const hasActivePro = subscriptions.some(
          (sub) => sub.status === "ACTIVE" && sub.name.toLowerCase().includes("pro")
        );

        await db.storeSetting.updateMany({
          where: { shop },
          data: { plan: hasActivePro ? "pro-plan" : "starter-plan" },
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};