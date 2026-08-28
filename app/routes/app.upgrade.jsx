import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Destructure 'redirect' from authenticate.admin, NOT @remix-run/node
  const { admin, session, redirect } = await authenticate.admin(request);

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

    if (confirmationUrl) {
      // Shopify's authenticated redirect forces top-level window navigation
      return redirect(confirmationUrl, { target: "_top" });
    }

    return redirect("/app");
  } catch (error) {
    console.error("Error creating subscription:", error);
    return redirect("/app");
  }
};