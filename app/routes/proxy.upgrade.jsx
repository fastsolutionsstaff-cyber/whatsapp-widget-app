import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);

    if (!admin || !session) {
      return new Response("Shopify store authentication is required.", {
        status: 401,
      });
    }

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
    const appHandle = data.data?.currentAppInstallation?.app?.handle;

    if (!appHandle) {
      return new Response("Shopify app handle could not be found.", {
        status: 500,
      });
    }

    const storeHandle = session.shop.resubplace
      ? session.shop.replace(".myshopify.com", "")
      : session.shop.replace(".myshopify.com", "");

    // Seedha app ke inside upgrade page par ya Shopify pricing flow par redirect karein
    const embeddedUpgradeUrl = `https://admin.shopify.com/store/${storeHandle}/apps/${appHandle}/upgrade`;

    return redirect(embeddedUpgradeUrl);
  } catch (error) {
    console.error("App Proxy Upgrade Error:", error);
    return new Response("Unable to open the upgrade page.", {
      status: 500,
    });
  }
}