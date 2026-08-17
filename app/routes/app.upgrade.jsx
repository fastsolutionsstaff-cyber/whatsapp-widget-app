import { json } from "@remix-run/node";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    
    // Get app handle
    const response = await admin.graphql(`
      query {
        currentAppInstallation {
          id
          app {
            handle
          }
        }
      }
    `);
    
    const data = await response.json();
    const appHandle = data.data?.currentAppInstallation?.app?.handle;
    const shop = session.shop;
    
    // Direct Shopify checkout URL for your plan
    const checkoutUrl = `https://admin.shopify.com/store/${shop}/admin/apps/${appHandle}/pricing`;
    
    return json({ 
      checkoutUrl,
      shop,
      appHandle 
    });
    
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

  const handleUpgrade = () => {
    if (data?.checkoutUrl) {
      window.top.location.href = data.checkoutUrl;
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

              <Button 
                primary 
                size="large"
                onClick={handleUpgrade}
              >
                Proceed to Secure Payment ($4.99/mo)
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}s