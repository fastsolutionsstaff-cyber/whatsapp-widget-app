import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }
    
    const shop = session.shop.replace(".myshopify.com", "");
    
    // DIRECT SHOPIFY BILLING URL
    const billingUrl = `https://admin.shopify.com/store/${shop}/admin/apps/widget-whatsapp/pricing`;
    
    return redirect(billingUrl);
    
  } catch (error) {
    console.error("Upgrade error:", error);
    return redirect("/app");
  }
}

export default function UpgradePage() {
  return null;
}