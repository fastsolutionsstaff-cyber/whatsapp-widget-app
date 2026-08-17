import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * Loader function for app upgrade page
 * Handles Shopify billing integration for Pro Plan
 */
export async function loader({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);
    
    if (!session) {
      return redirect("/auth");
    }

    // Check if merchant already has an active Pro subscription
    try {
      const checkBilling = await billing.check({
        plans: ["Pro Plan"],
        isTest: false,
      });

      // If already subscribed, redirect to settings page
      if (checkBilling.hasActiveSubscriptions) {
        return redirect("/app");
      }
    } catch (checkError) {
      console.log("No existing subscription found, proceeding with billing request");
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

    // Fallback if something goes wrong
    return redirect("/app");

  } catch (error) {
    console.error("Billing error:", error);
    // If billing fails, redirect to app store listing
    return redirect("https://apps.shopify.com/widget-whatsapp");
  }
}

/**
 * Upgrade page component
 * Returns null as loader handles all redirects
 */
export default function UpgradePage() {
  return null;
}