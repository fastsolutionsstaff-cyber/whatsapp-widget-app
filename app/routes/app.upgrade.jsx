import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const apiKey = process.env.SHOPIFY_API_KEY;
  const returnUrl = `https://${session.shop}/admin/apps/${apiKey}/app`;

  try {
    const response = await admin.graphql(
      `#graphql
      mutation appSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean) {
        appSubscriptionCreate(
          name: $name
          returnUrl: $returnUrl
          lineItems: $lineItems
          test: $test
        ) {
          userErrors {
            field
            message
          }
          confirmationUrl
          appSubscription {
            id
          }
        }
      }`,
      {
        variables: {
          name: "Pro Plan",
          returnUrl: returnUrl,
          test: process.env.NODE_ENV !== "production",
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: { amount: 4.99, currencyCode: "USD" },
                  interval: "EVERY_30_DAYS",
                },
              },
            },
          ],
        },
      }
    );

    const data = await response.json();
    const confirmationUrl = data.data?.appSubscriptionCreate?.confirmationUrl;
    const userErrors = data.data?.appSubscriptionCreate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      console.error("Subscription creation errors:", userErrors);
      return json({ error: userErrors[0].message }, { status: 400 });
    }

    if (confirmationUrl) {
      // Return a script that redirects the parent window to the confirmation URL
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Redirecting to Shopify Billing...</title>
          </head>
          <body>
            <script>
              window.top.location.href = "${confirmationUrl}";
            </script>
            <p>Redirecting to Shopify billing...</p>
          </body>
        </html>`,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    // If no confirmation URL, redirect back to app
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting...</title>
        </head>
        <body>
          <script>
            window.top.location.href = "/app";
          </script>
          <p>Redirecting...</p>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <script>
            window.top.location.href = "/app";
          </script>
          <p>Error occurred. Redirecting back...</p>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }
};