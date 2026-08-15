import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  try {
    /*
     * Get the real Shopify App handle directly from Shopify.
     * This avoids hardcoding the app handle.
     */
    const response = await admin.graphql(`
      #graphql
      query GetAppHandle {
        currentAppInstallation {
          app {
            handle
          }
        }
      }
    `);

    const data = await response.json();

    const appHandle =
      data.data?.currentAppInstallation?.app?.handle;

    if (!appHandle) {
      throw new Error("Shopify app handle could not be found.");
    }

    const shop = session.shop;

    const storeHandle = shop.replace(".myshopify.com", "");

    /*
     * Shopify App Pricing hosted plan-selection page.
     */
    const pricingUrl =
      `https://admin.shopify.com/store/${storeHandle}` +
      `/charges/${appHandle}/pricing_plans`;

    return redirect(pricingUrl);
  } catch (error) {
    console.error("Upgrade redirect error:", error);

    throw new Response(
      "Unable to open the Shopify pricing page.",
      {
        status: 500,
      }
    );
  }
}