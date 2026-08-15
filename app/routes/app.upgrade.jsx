import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing, session } = await authenticate.admin(request);

  try {
    const checkBilling = await billing.check({
      plans: ["pro-plan"],
      isTest: true,
    });

    if (checkBilling.hasActiveSubscriptions) {
      return redirect("/app");
    }

    const response = await billing.request({
      plan: "pro-plan",
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`,
    });

    return json({ confirmationUrl: response.confirmationUrl, error: null });
  } catch (error) {
    console.error("Billing redirect error:", error);
    return json({ confirmationUrl: null, error: error.message || "Unknown billing error" });
  }
}

export default function UpgradePage() {
  const data = useLoaderData();
  const submit = useSubmit();

  if (data?.confirmationUrl && typeof window !== "undefined") {
    window.top.location.href = data.confirmationUrl;
  }

  const handleUpgradeClick = () => {
    submit(null, { method: "get" });
  };

  return (
    <Page title="Upgrade to Pro">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Unlock Pro Features — $4.99/mo</Text>
              <Text as="p">
                Get unlimited WhatsApp clicks on both your home and product page widgets, remove free tier restrictions, and boost your store conversions instantly.
              </Text>
              {data?.error && (
                <Text tone="critical">Billing Error Details: {data.error}</Text>
              )}
              <Button primary size="large" onClick={handleUpgradeClick}>
                Proceed to Secure Payment
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}