import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session, redirect } = await authenticate.admin(request);
  const storeHandle = session.shop.replace(".myshopify.com", "");
  const appHandle = "96d13c204caa88f27a5fd216a6caa250"; // your app's real handle (matches client_id)

  return redirect(
    `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`,
    { target: "_top" }
  );
}
