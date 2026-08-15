import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    // Shopify ka official billing request jo $4.99/month ka Pro Plan trigger karega
    return await billing.request({
      plan: "pro-plan",
      isTest: true, // Jab app live karni ho toh isay false kar dena
      returnUrl: `https://${new URL(request.url).host}/app`,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    throw error;
  }
}