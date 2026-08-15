import { json, redirect } from "@remix-run/node";
import { useSubmit, Form } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    return await billing.request({
      plan: "pro-plan",
      isTest: true,
      returnUrl: `https://${new URL(request.url).host}/app`,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return redirect("/app");
  }
}

export default function UpgradePage() {
  const submit = useSubmit();

  return (
    <Page title="Upgrade to Pro">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Unlock Pro Features — $4.99/mo</Text>
              <Text as="p">
                Get unlimited WhatsApp clicks, remove free tier restrictions, and boost your customer conversions instantly.
              </Text>
              <Form method="post">
                <Button submit variant="primary" tone="success" size="large">
                  Proceed to Secure Payment
                </Button>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}