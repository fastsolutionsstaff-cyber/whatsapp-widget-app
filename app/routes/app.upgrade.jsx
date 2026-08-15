import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    // Direct billing request in loader
    const response = await billing.request({
      plan: "pro-plan",
      isTest: true,
      returnUrl: `https://${new URL(request.url).host}/app`,
    });
    return response;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Billing error:", error);
    return json({ error: error.message });
  }
}

export default function UpgradePage() {
  const data = useLoaderData();

  // Agar server side se confirmation URL mil jaye, toh window top ko wahan bhej dein
  if (data?.confirmationUrl) {
    if (typeof window !== "undefined") {
      window.top.location.href = data.confirmationUrl;
    }
  }

  return (
    <Page title="Upgrade to Pro">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Unlock Pro Features — $4.99/mo</Text>
              <Text as="p">
                Redirecting to secure Shopify checkout... If you are not redirected automatically, please refresh the page.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
