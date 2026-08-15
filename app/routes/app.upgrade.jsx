import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    const response = await billing.request({
      plan: "pro-plan",
      isTest: true,
      returnUrl: `https://${new URL(request.url).host}/app`,
    });

    // Confirmation URL ko JSON mein pass kar dein
    return json({ confirmationUrl: response.confirmationUrl });
  } catch (error) {
    console.error("Billing error:", error);
    return json({ confirmationUrl: null, error: error.message });
  }
}

export default function UpgradePage() {
  const data = useLoaderData();

  // Jaise hi server se confirmation URL aaye, parent window ko payment page par bhej do
  if (data?.confirmationUrl && typeof window !== "undefined") {
    window.top.location.href = data.confirmationUrl;
  }

  return (
    <Page title="Upgrade to Pro">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Unlock Pro Features — $4.99/mo</Text>
              <Text as="p">
                {data?.error 
                  ? `Error: ${data.error}` 
                  : "Redirecting to secure Shopify payment gateway... Please wait."}
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}