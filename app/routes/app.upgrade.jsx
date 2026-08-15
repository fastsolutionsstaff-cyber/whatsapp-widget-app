import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session, redirect } = await authenticate.admin(request);

  const storeHandle = session.shop.replace(".myshopify.com", "");

  const appHandle = "widget-whatsapp";

  const pricingUrl =
    `https://admin.shopify.com/store/${storeHandle}` +
    `/charges/${appHandle}/pricing_plans`;

  return redirect(pricingUrl, {
    target: "_top",
  });
}

export default function Upgrade() {
  return null;
}