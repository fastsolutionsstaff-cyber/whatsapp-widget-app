import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// Loader
export async function loader({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);
    
    // Check if already on Pro
    const subscriptions = await billing.check({
      plans: ["Pro Plan - $4.99/mo"],
      isTest: true,
    });

    // Agar already Pro hai
    if (subscriptions.hasActiveSubscriptions) {
      return redirect("/app");
    }

    // Billing request
    const response = await billing.request({
      plan: "Pro Plan - $4.99/mo",
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
    });

    return json({ 
      confirmationUrl: response.confirmationUrl, 
      error: null 
    });

  } catch (error) {
    console.error("Loader error:", error);
    return json({ 
      confirmationUrl: null, 
      error: "Unable to process billing. Please try again." 
    });
  }
}

// Action
export async function action({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);

    const response = await billing.request({
      plan: "Pro Plan - $4.99/mo",
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
    });

    return redirect(response.confirmationUrl);

  } catch (error) {
    console.error("Action error:", error);
    return json({ 
      confirmationUrl: null, 
      error: "Billing error. Please try again." 
    });
  }
}

export default function UpgradePage() {
  const data = useLoaderData();

  // Error show karo
  if (data?.error) {
    return (
      <Page title="Upgrade to Pro">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Upgrade to Pro</Text>
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

  // Agar confirmationUrl hai toh auto redirect
  if (data?.confirmationUrl && typeof window !== "undefined") {
    window.top.location.href = data.confirmationUrl;
    return null;
  }

  // Page show karo
  return (
    <Page title="Upgrade to Pro">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">
                🚀 Unlock Pro Features — $4.99/mo
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