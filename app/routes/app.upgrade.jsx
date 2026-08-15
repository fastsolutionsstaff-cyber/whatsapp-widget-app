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
    
    // Agar direct URL string mil jaye ya object
    const confirmationUrl = response?.confirmationUrl || response;
    if (confirmationUrl && typeof confirmationUrl === "string") {
      throw new Response(null, {
        status: 302,
        headers: { Location: confirmationUrl },
      });
    }
    return response;
  } catch (error) {
    if (error instanceof Response) throw error;
    throw error;
  }
}

export default function UpgradePage() {
  return (
    <Page title="Upgrade to Pro">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Unlock Pro Features — $4.99/mo</Text>
              <Text as="p">
                Get unlimited WhatsApp clicks, remove free tier restrictions, and boost your conversions instantly.
              </Text>
              <div>
                <a
                  href="/app/upgrade"
                  target="_top"
                  style={{
                    display: "inline-block",
                    background: "#008060",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Proceed to Secure Payment
                </a>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}