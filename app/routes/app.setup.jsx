import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Divider } from "@shopify/polaris";

export default function Setup() {
  return (
    <Page
      title="Setup Guide"
      subtitle="Get your WhatsApp widget ready for your storefront."
    >
      <BlockStack gap="500">
        <Banner
          title="Welcome to WhatsApp Widget"
          tone="info"
        >
          <p>
            Follow these simple steps to connect WhatsApp and launch your
            customer chat widget.
          </p>
        </Banner>

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">

              {/* Step 1 */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <Badge tone="success">1</Badge>
                      <Text as="h2" variant="headingMd">
                        Add your WhatsApp number
                      </Text>
                    </InlineStack>

                    <Badge tone="success">Ready</Badge>
                  </InlineStack>

                  <Text as="p" tone="subdued">
                    Enter the WhatsApp number that your customers should
                    contact when they click your widget.
                  </Text>

                  <Button url="/app">
                    Configure WhatsApp
                  </Button>
                </BlockStack>
              </Card>

              {/* Step 2 */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <Badge tone="success">2</Badge>
                      <Text as="h2" variant="headingMd">
                        Customize your widget
                      </Text>
                    </InlineStack>

                    <Badge tone="success">Ready</Badge>
                  </InlineStack>

                  <Text as="p" tone="subdued">
                    Choose your icon, color, size, position and greeting
                    message to match your storefront.
                  </Text>

                  <Button url="/app">
                    Customize Widget
                  </Button>
                </BlockStack>
              </Card>

              {/* Step 3 */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <Badge tone="attention">3</Badge>
                      <Text as="h2" variant="headingMd">
                        Add the widget to your storefront
                      </Text>
                    </InlineStack>

                    <Badge tone="attention">Next Step</Badge>
                  </InlineStack>

                  <Text as="p" tone="subdued">
                    Open your Shopify Theme Editor and add the WhatsApp
                    Widget app block to your storefront.
                  </Text>

                  <Button>
                    Open Theme Editor
                  </Button>
                </BlockStack>
              </Card>

              {/* Step 4 */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <Badge tone="attention">4</Badge>
                      <Text as="h2" variant="headingMd">
                        Test your widget
                      </Text>
                    </InlineStack>

                    <Badge tone="attention">Final Step</Badge>
                  </InlineStack>

                  <Text as="p" tone="subdued">
                    Visit your storefront and click the WhatsApp button to
                    make sure everything is working correctly.
                  </Text>

                  <Button>
                    Test Widget
                  </Button>
                </BlockStack>
              </Card>

            </BlockStack>
          </Layout.Section>

          {/* Right side */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Your setup
                </Text>

                <Text as="p" tone="subdued">
                  Complete the steps on the left to get your WhatsApp widget
                  live.
                </Text>

                <Divider />

                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <Text>WhatsApp connection</Text>
                    <Badge tone="success">Ready</Badge>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text>Widget customization</Text>
                    <Badge tone="success">Ready</Badge>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text>Storefront installation</Text>
                    <Badge tone="attention">Pending</Badge>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text>Final testing</Text>
                    <Badge tone="attention">Pending</Badge>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}