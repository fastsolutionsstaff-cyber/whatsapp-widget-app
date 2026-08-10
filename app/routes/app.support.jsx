import { json } from "@remix-run/node";
import { Page, Layout, Card, Text, BlockStack, Button, InlineStack, Box, Divider } from "@shopify/polaris";

export const loader = async () => {
  return json({});
};

export default function Support() {
  return (
    <Page title="Support & Help Center" subtitle="We are here to help you get the most out of your app">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Need Assistance?
                </Text>
                <Text variant="bodyMd" as="p">
                  If you encounter any issues, bugs, or need help configuring features (such as widget positioning, custom icons, or app integration), our support team is available 24/7 to assist you.
                </Text>

                <Box background="bg-surface-secondary" padding="400" borderRadius="200">
                  <BlockStack gap="200">
                    <Text variant="headingSm" as="h3">
                      📧 Direct Email Support
                    </Text>
                    <Text variant="bodyMd" as="p">
                      Send us an email anytime at: <strong>support@fastsolution.com</strong>
                    </Text>
                    <Text variant="bodySm" tone="subdued" as="p">
                      Average response time: Under 4 hours.
                    </Text>
                  </BlockStack>
                </Box>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Frequently Asked Questions
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Q: How do I change the widget icon?</strong><br />
                  A: Go to the main dashboard, select your preferred icon from the preset styles, or choose "Custom Image" to paste your hosted PNG/JPG link.
                </Text>
                <Divider />
                <Text variant="bodyMd" as="p">
                  <strong>Q: Will this app slow down my store?</strong><br />
                  A: No, our app uses optimized lightweight scripts designed to load asynchronously without impacting your store's Core Web Vitals.
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}