import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * Loader function for app upgrade page
 * Redirects to Shopify billing page for Pro Plan subscription
 */
export async function loader({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }

    // Check if merchant already has an active subscription
    const checkBilling = await billing.check({
      plans: ["Pro Plan"],
      isTest: false,
    });

    // If already subscribed, redirect to settings page
    if (checkBilling.hasActiveSubscriptions) {
      return redirect("/app");
    }

    // Initiate billing request for Pro Plan
    const response = await billing.request({
      plan: "Pro Plan",
      isTest: false,
      returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
    });

    // Redirect to Shopify checkout page
    if (response.confirmationUrl) {
      return redirect(response.confirmationUrl);
    }

    // Fallback redirect if something goes wrong
    return redirect("/app");

  } catch (error) {
    console.error("Billing error:", error);
    return redirect("/app");
  }
}

/**
 * Upgrade page component
 * Returns null as loader handles all redirects
 */
export default function UpgradePage() {
  return null;
}