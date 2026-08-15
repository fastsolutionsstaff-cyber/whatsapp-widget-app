import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  try {
    const response = await admin.graphql(`
      #graphql
      query GetAppHandle {
        currentAppInstallation {
          app {
            handle
          }
        }
      }
    `);

    const data = await response.json();

    const appHandle =
      data.data?.currentAppInstallation?.app?.handle;

    if (!appHandle) {
      throw new Error("Shopify app handle could not be found.");
    }

    const storeHandle = session.shop.replace(".myshopify.com", "");

    const pricingUrl =
      `https://admin.shopify.com/store/${storeHandle}` +
      `/charges/${appHandle}/pricing_plans`;

    return Response.json({
      pricingUrl,
    });
  } catch (error) {
    console.error("Upgrade page error:", error);

    throw new Response(
      "Unable to open Shopify pricing page.",
      {
        status: 500,
      }
    );
  }
}

export default function UpgradePage() {
  const { pricingUrl } = useLoaderData();

  return (
    <html>
      <head>
        <title>Upgrade to Pro</title>
      </head>

      <body
        style={{
          margin: 0,
          padding: 40,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <h2>Opening Shopify Pricing...</h2>

        <p>
          You are being redirected to the Shopify
          Pro Plan page.
        </p>

        <button
          onClick={() => {
            window.top.location.href = pricingUrl;
          }}
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#008060",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Continue to Pro Plan
        </button>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.top.location.href = ${JSON.stringify(pricingUrl)};
            `,
          }}
        />
      </body>
    </html>
  );
}