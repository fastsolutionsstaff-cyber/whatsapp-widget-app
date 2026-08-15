import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin, redirect } = await authenticate.admin(request);

  const appUrl = new URL(request.url).origin;

  const response = await admin.graphql(
    `#graphql
    mutation AppSubscriptionCreate(
      $name: String!
      $lineItems: [AppSubscriptionLineItemInput!]!
      $returnUrl: URL!
      $test: Boolean
    ) {
      appSubscriptionCreate(
        name: $name
        lineItems: $lineItems
        returnUrl: $returnUrl
        test: $test
      ) {
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        name: "Pro Plan",
        returnUrl: `${appUrl}/app`,
        test: true, // set this to false once you're ready for real merchants to be charged for real
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
  const result = data.data.appSubscriptionCreate;

  if (result.userErrors.length > 0) {
    console.error("Billing error:", result.userErrors);
    throw new Response(result.userErrors[0].message, { status: 400 });
  }

  return redirect(result.confirmationUrl, { target: "_top" });
}
