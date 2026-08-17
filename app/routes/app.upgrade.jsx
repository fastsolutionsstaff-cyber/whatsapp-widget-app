import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    
    // Direct GraphQL mutation with your plan handle
    const response = await admin.graphql(`
      mutation {
        appSubscriptionCreate(
          name: "Pro Plan"
          returnUrl: "https://${session.shop}/admin/apps/widget-whatsapp"
          test: true
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: { amount: 4.99, currencyCode: USD }
                }
              }
            }
          ]
        ) {
          appSubscription {
            id
            status
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      }
    `);

    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
    
    const data = result.data?.appSubscriptionCreate;
    
    if (data?.userErrors?.length > 0) {
      return json({ 
        error: data.userErrors[0].message 
      });
    }

    if (data?.confirmationUrl) {
      return redirect(data.confirmationUrl);
    }

    return json({ error: "No confirmation URL received" });

  } catch (error) {
    console.error("Error:", error);
    return json({ error: error.message });
  }
}

export default function UpgradePage() {
  const data = useLoaderData();

  if (data?.error) {
    return (
      <Page title="Upgrade to Pro">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Upgrade to Pro Plan</Text>
                <Banner title="Error" tone="critical">
                  <p>{data.error}</p>
                </Banner>
                <Button onClick={() => window.location.href = "/app"}>
                  Back to Settings
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Upgrade to Pro Plan">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">
                🚀 Unlock Pro Plan — $4.99/mo
              </Text>
              
              <BlockStack gap="200">
                <Text as="p">✅ Unlimited WhatsApp clicks</Text>
                <Text as="p">✅ Home & Product page widgets</Text>
                <Text as="p">✅ No free tier restrictions</Text>
                <Text as="p">✅ Priority support</Text>
              </BlockStack>

              <form method="POST">
                <Button 
                  primary 
                  size="large"
                  submit
                >
                  Proceed to Secure Payment ($4.99/mo)
                </Button>
              </form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}