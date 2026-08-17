import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }
    
    // Check if already on Pro Plan
    const checkBilling = await billing.check({
      plans: ["Pro Plan"],
      isTest: true,
    });

    // Agar already Pro hai toh wapas settings par
    if (checkBilling.hasActiveSubscriptions) {
      return redirect("/app");
    }

    // Billing request with test mode
    const response = await billing.request({
      plan: "Pro Plan",
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
    });

    if (response.confirmationUrl) {
      return redirect(response.confirmationUrl);
    }

    return redirect("/app");

  } catch (error) {
    console.error("Billing error:", error);
    return redirect("/app");
  }
}

export default function UpgradePage() {
  return null;
}