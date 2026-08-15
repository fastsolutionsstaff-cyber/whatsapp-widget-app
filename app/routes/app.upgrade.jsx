import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    // Shopify billing request with error fallback
    return await billing.request({
      plan: "pro-plan",
      isTest: true,
      returnUrl: `https://${new URL(request.url).host}/app`,
    });
  } catch (error) {
    // Agar redirect response hai toh usay throw hone dein
    if (error instanceof Response) {
      throw error;
    }
    console.error("Billing request error:", error);
    // Error ki surat mein app dashboard par wapas bhej dein taake 500 error na aaye
    return redirect("/app");
  }
}