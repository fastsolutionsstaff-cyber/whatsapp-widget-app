import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function HelpPage() {
  return (
    <Page title="FAQ & Merchant Help" subtitle="Get quick answers to common integration questions.">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Frequently Asked Questions</Text>
              <Text variant="bodyMd" as="p">
                <strong>Q: How do I change my WhatsApp phone number?</strong><br />
                A: Go to your main Dashboard and update the phone number field under Merchant Setup, then click Save.
              </Text>
              <Text variant="bodyMd" as="p">
                <strong>Q: Why is the widget not showing on my live store?</strong><br />
                A: Ensure your app embedding is enabled in your Shopify Theme Editor under App Embeds.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}