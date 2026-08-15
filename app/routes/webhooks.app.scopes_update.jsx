import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  switch (topic) {
    case "APP_SUBSCRIPTIONS_UPDATE": {
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

      // Database mein store ka plan update karein
      await db.storeSetting.updateMany({
        where: { shop: shop },
        data: { plan: hasActivePro ? "pro-plan" : "starter-plan" },
      });
      break;
    }

    case "APP_SCOPES_UPDATE": {
      if (session) {
        await db.session.update({
          where: { id: session.id },
          data: { scope: payload.current.toString() },
        });
      }
      break;
    }
  }

  return new Response();
};