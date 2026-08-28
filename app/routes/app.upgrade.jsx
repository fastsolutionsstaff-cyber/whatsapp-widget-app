import { redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";

export async function loader({ request }) {
  return handleUpgrade(request);
}

export async function action({ request }) {
  return handleUpgrade(request);
}

async function handleUpgrade(request) {
  try {
    const { billing, session } = await authenticate.admin(request);

    if (!session) {
      return redirect("/auth");
    }

    // 1. Check if merchant already has an active Pro subscription
    try {
      const checkBilling = await billing.check({
        plans: [MONTHLY_PLAN],
        isTest: true,
      });

      if (checkBilling.hasActiveSubscriptions) {
        return redirect("/app");
      }
    } catch (checkError) {
      console.log("No existing subscription found, proceeding with billing request");
    }

    // 2. Directly return billing.request to let App Bridge perform the top-level iframe exit
    return await billing.request({
      plan: MONTHLY_PLAN,
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_APP_HANDLE || "fs-whatsapp"}`,
    });

  } catch (error) {
    console.error("Billing error:", error);
    return redirect("/app");
  }
}

export default function UpgradePage() {
  return null;
}