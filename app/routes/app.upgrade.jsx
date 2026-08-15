import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  const shop = session.shop.replace(".myshopify.com", "");

  const url =
    `https://admin.shopify.com/store/${shop}/charges`;

  return redirect(url, {
    target: "_top",
  });
}

export default function Upgrade() {
  return null;
}