import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Divider,
  Badge,
  Box,
} from "@shopify/polaris";

export default function About() {
  return (
    <Page
      title="About WhatsApp Widget"
      subtitle="Simple WhatsApp communication for your Shopify store."
    >
      <BlockStack gap="500">

        {/* Hero */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="200">
                <Text as="h2" variant="headingLg">
                  WhatsApp Widget
                </Text>

                <Text as="p" tone="subdued">
                  Give your customers a fast and familiar way to contact
                  your business directly through WhatsApp.
                </Text>
              </BlockStack>

              <Badge tone="success">Active</Badge>
            </InlineStack>

            <Divider />

            <Text as="p">
              WhatsApp Widget lets you add a customizable WhatsApp contact
              experience to your Shopify storefront. Configure your
              WhatsApp number, appearance, position and customer message
              from one simple dashboard.
            </Text>
          </BlockStack>
        </Card>

        {/* Features */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  What you can do
                </Text>

                <Divider />

                <BlockStack gap="400">
                  <BlockStack gap="100">
                    <Text as="h3" variant="headingSm">
                      Customize your widget
                    </Text>

                    <Text as="p" tone="subdued">
                      Choose your preferred icon, colors, size, position and
                      customer greeting.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="100">
                    <Text as="h3" variant="headingSm">
                      Connect your WhatsApp
                    </Text>

                    <Text as="p" tone="subdued">
                      Set the WhatsApp number that should receive customer
                      conversations.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="100">
                    <Text as="h3" variant="headingSm">
                      Preview before publishing
                    </Text>

                    <Text as="p" tone="subdued">
                      Use the built-in preview to see how your widget looks
                      before applying your settings.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="100">
                    <Text as="h3" variant="headingSm">
                      Mobile-friendly experience
                    </Text>

                    <Text as="p" tone="subdued">
                      Configure desktop and mobile widget sizing and
                      positioning independently.
                    </Text>
                  </BlockStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* App Information */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  App Information
                </Text>

                <Divider />

                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text>App</Text>
                    <Text fontWeight="semibold">
                      WhatsApp Widget
                    </Text>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text>Status</Text>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text>Platform</Text>
                    <Text>Shopify</Text>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text>Version</Text>
                    <Text>1.0</Text>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Privacy */}
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Privacy & Data
            </Text>

            <Text as="p" tone="subdued">
              Your store settings are used to configure the WhatsApp Widget
              experience for your storefront. We recommend reviewing your
              app's privacy policy and data practices before submitting the
              app to the Shopify App Store.
            </Text>
          </BlockStack>
        </Card>

        {/* Footer */}
        <Card>
          <Box padding="300">
            <InlineStack
              align="space-between"
              blockAlign="center"
              wrap={false}
            >
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  WhatsApp Widget
                </Text>

                <Text as="p" tone="subdued">
                  Built to make customer communication simple.
                </Text>
              </BlockStack>

              <Text as="span" tone="subdued">
                Version 1.0
              </Text>
            </InlineStack>
          </Box>
        </Card>

      </BlockStack>
    </Page>
  );
}