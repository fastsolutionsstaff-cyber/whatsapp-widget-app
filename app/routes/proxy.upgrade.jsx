import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } =
      await authenticate.public.appProxy(request);

    if (!admin || !session) {
      return new Response(
        "Shopify store authentication is required.",
        {
          status: 401,
        }
      );
    }

    /*
     * Get the actual Shopify app handle.
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
      return new Response(
        "Shopify app handle could not be found.",
        {
          status: 500,
        }
      );
    }

    /*
     * Convert:
     * test-faizan-demo.myshopify.com
     *
     * into:
     * test-faizan-demo
     */
    const storeHandle = session.shop.replace(
      ".myshopify.com",
      ""
    );

    /*
     * Shopify App Pricing hosted page.
     */
    const pricingUrl =
      `https://admin.shopify.com/store/${storeHandle}` +
      `/charges/${appHandle}/pricing_plans`;

    return redirect(pricingUrl);
  } catch (error) {
    console.error(
      "App Proxy Upgrade Error:",
      error
    );

    return new Response(
      "Unable to open the upgrade page.",
      {
        status: 500,
      }
    );
  }
}