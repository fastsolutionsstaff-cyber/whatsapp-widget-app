import { json } from "@remix-run/node";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    
    // Get app handle and shop domain
    const response = await admin.graphql(`
      query {
        currentAppInstallation {
          app {
            handle
          }
        }
      }
    `);
    
    const data = await response.json();
    const appHandle = data.data?.currentAppInstallation?.app?.handle || "widget-whatsapp";
    
    // Shopify checkout URL for Pro Plan
    const checkoutUrl = `https://apps.shopify.com/${appHandle}/pricing`;
    
    return json({ 
      checkoutUrl,
      error: null 
    });
    
  } catch (error) {
    console.error("Error:", error);
    return json({ 
      checkoutUrl: null, 
      error: "Unable to load pricing. Please try again." 
    });
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

  const handleUpgrade = () => {
    // Open in new tab so app doesn't hang
    if (data?.checkoutUrl) {
      window.open(data.checkoutUrl, "_blank");
    }
  };

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

              <Text as="p" tone="subdued">
                Click below to purchase. Payment page will open in a new tab.
              </Text>

              <Button 
                primary 
                size="large"
                onClick={handleUpgrade}
              >
                Purchase Pro Plan ($4.99/mo)
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}