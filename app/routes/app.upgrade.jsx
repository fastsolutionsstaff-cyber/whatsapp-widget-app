import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }
    
    // Direct Shopify App Store Listing
    // Jab app publish ho jaye toh yeh kaam karega
    const appStoreUrl = "https://apps.shopify.com/widget-whatsapp";
    
    return redirect(appStoreUrl);
    
  } catch (error) {
    console.error("Upgrade error:", error);
    return redirect("/app");
  }
}

export default function UpgradePage() {
  return null;
}