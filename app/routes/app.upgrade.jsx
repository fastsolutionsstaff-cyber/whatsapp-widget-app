import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  const shop = session.shop.replace(".myshopify.com", "");

  const pricingUrl =
    `https://admin.shopify.com/store/${shop}/charges/widget-whatsapp/pricing_plans`;

  return new Response(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Upgrade to Pro</title>
        </head>
        <body>
          <script>
            window.top.location.href = ${JSON.stringify(pricingUrl)};
          </script>

          <p>
            Redirecting to Shopify pricing...
          </p>
        </body>
      </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}

export default function Upgrade() {
  return null;
}