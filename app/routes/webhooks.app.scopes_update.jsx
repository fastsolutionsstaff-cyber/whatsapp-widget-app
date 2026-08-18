import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

    switch (topic) {
      case "APP_SUBSCRIPTIONS_UPDATE": {
        if (!admin) break;

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
        break;
      }

      case "APP_SCOPES_UPDATE": {
        if (session && payload?.current) {
          await db.session.update({
            where: { id: session.id },
            data: { scope: payload.current.toString() },
          });
        }
        break;
      }

      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};