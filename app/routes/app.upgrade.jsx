import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  const shop = session.shop.replace(".myshopify.com", "");

  const pricingUrl =
    `https://admin.shopify.com/store/${shop}` +
    `/charges/widget-whatsapp/pricing_plans`;

  return redirect(pricingUrl, {
    target: "_top",
  });
}

export default function Upgrade() {
  return null;
}