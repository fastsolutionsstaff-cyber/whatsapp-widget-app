import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// Loader - Jab page open ho
export async function loader({ request }) {
  const { billing, session } = await authenticate.admin(request);

  // Check if already on Pro
  const checkBilling = await billing.check({
    plans: ["pro-plan"],
    isTest: true,
  });

  // Agar already Pro hai toh settings page par redirect
  if (checkBilling.hasActiveSubscriptions) {
    return redirect("/app");
  }

  // Billing request bhejo
  const response = await billing.request({
    plan: "pro-plan",
    isTest: true,
    returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
  });

  // Confirmation URL wapis bhejo
  return json({ 
    confirmationUrl: response.confirmationUrl, 
    error: null 
  });
}

// Action - Jab button click ho
export async function action({ request }) {
  const { billing, session } = await authenticate.admin(request);

  // Billing request bhejo
  const response = await billing.request({
    plan: "pro-plan",
    isTest: true,
    returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
  });

  // Shopify payment page par redirect
  return redirect(response.confirmationUrl);
}

export default function UpgradePage() {
  const data = useLoaderData();

  // Agar error hai toh show karo
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

  // Agar confirmationUrl hai toh automatically redirect
  if (data?.confirmationUrl && typeof window !== "undefined") {
    window.top.location.href = data.confirmationUrl;
    return null;
  }

  // Upgrade page show karo
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