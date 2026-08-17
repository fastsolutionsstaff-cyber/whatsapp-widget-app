import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Page, Layout, Card, Button, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { billing, session } = await authenticate.admin(request);
    
    // Check if already on Pro Plan
    const checkBilling = await billing.check({
      plans: ["Pro Plan"],
      isTest: true,
    });

    // Agar already Pro hai toh wapas settings par
    if (checkBilling.hasActiveSubscriptions) {
      return redirect("/app");
    }

    // Billing request - yeh Shopify Admin ke andar hi rahega
    const response = await billing.request({
      plan: "Pro Plan",
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/widget-whatsapp`,
    });

    if (response.confirmationUrl) {
      return redirect(response.confirmationUrl);
    }

    return json({ error: "Unable to create billing session" });

  } catch (error) {
    console.error("Billing error:", error);
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

  return null;
}