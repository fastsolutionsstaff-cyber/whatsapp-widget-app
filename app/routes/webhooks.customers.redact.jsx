import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  const { shop } = await authenticate.admin(request);
  const data = await request.json();

  console.log("Customer redact webhook received:", { shop, data });

  // Delete customer data from database
  await prisma.storeSetting.deleteMany({
    where: { shop },
  });

  return new Response("OK", { status: 200 });
}