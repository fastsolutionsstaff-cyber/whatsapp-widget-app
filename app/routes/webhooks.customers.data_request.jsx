import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { shop } = await authenticate.admin(request);
  const data = await request.json();

  console.log("Customer data request webhook received:", { shop, data });

  // Shopify expects a 200 OK response
  return new Response("OK", { status: 200 });
}