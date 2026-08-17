import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);
    
    // Check if already on Professional Plan
    const checkBilling = await billing.check({
      plans: ["Professional Plan"],  // ← YEH SAHI NAME HAI
      isTest: true,
    });

    // Agar already Professional Plan hai toh redirect
    if (checkBilling.hasActiveSubscriptions) {
      return redirect("/app");
    }

    // Billing request
    const response = await billing.request({
      plan: "Professional Plan",  // ← YEH SAHI NAME HAI
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
    });

    // Shopify payment page par redirect
    if (response.confirmationUrl) {
      return redirect(response.confirmationUrl);
    }

    return json({ error: "No confirmation URL received" });

  } catch (error) {
    console.error("Billing Error:", error);
    return json({ error: error.message || "Billing error occurred" });
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
                <Text variant="headingMd" as="h2">Upgrade to Professional Plan</Text>
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
    <Page title="Upgrade to Professional Plan">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">
                🚀 Unlock Professional Plan — $4.99/mo
              </Text>
              
              <BlockStack gap="200">
                <Text as="p">✅ Unlimited WhatsApp clicks</Text>
                <Text as="p">✅ Home & Product page widgets</Text>
                <Text as="p">✅ No free tier restrictions</Text>
                <Text as="p">✅ Priority support</Text>
              </BlockStack>

              <Text as="p" tone="subdued">
                Clicking below will redirect you to Shopify's secure checkout.
              </Text>

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