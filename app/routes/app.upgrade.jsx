import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }
    
    // Get app handle
    const response = await admin.graphql(`
      query {
        currentAppInstallation {
          app {
            handle
          }
        }
      }
    `);
    
    const data = await response.json();
    const appHandle = data.data?.currentAppInstallation?.app?.handle || "widget-whatsapp";
    const shop = session.shop.replace(".myshopify.com", "");
    
    // Direct Shopify Admin Billing URL
    const billingUrl = `https://admin.shopify.com/store/${shop}/admin/apps/${appHandle}/pricing`;
    
    return redirect(billingUrl);
    
  } catch (error) {
    console.error("Upgrade error:", error);
    return redirect("/app");
  }
}

export default function UpgradePage() {
  return null;
}