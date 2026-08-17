import { redirect } from "@remix-run/node";

export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const host = url.searchParams.get("host");
    
    if (!host) {
      return redirect("/app");
    }
    
    // Decode host to get shop domain
    const decodedHost = decodeURIComponent(host);
    const shop = decodedHost.replace(".myshopify.com", "");
    
    // Direct Shopify billing page
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