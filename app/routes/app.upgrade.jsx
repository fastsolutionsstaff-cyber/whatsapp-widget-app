import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }
    
    // Direct Shopify pricing page
    const shop = session.shop;
    const pricingUrl = `https://admin.shopify.com/store/${shop}/admin/apps/widget-whatsapp/pricing`;
    
    return redirect(pricingUrl);
    
  } catch (error) {
    console.error("Upgrade error:", error);
    // Fallback redirect
    return redirect("/app");
  }
}

export default function UpgradePage() {
  return null;
}