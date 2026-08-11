import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Divider,
  EmptyState,
  Box,
} from "@shopify/polaris";

export default function Analytics() {
  return (
    <Page
      title="Analytics"
      subtitle="Understand how customers interact with your WhatsApp widget."
    >
      <BlockStack gap="500">

        {/* Overview */}
        <Layout>
          <Layout.Section>
            <Layout>
              <Layout.Section>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Widget Clicks
                    </Text>

                    <Text as="p" variant="heading2xl">
                      —
                    </Text>

                    <Text as="p" tone="subdued">
                      Total WhatsApp widget interactions
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Conversations
                    </Text>

                    <Text as="p" variant="heading2xl">
                      —
                    </Text>

                    <Text as="p" tone="subdued">
                      Customer conversations started
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Conversion Rate
                    </Text>

                    <Text as="p" variant="heading2xl">
                      —
                    </Text>

                    <Text as="p" tone="subdued">
                      Widget interactions over visits
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
        </Layout>

        {/* Activity */}
        <Card>
          <BlockStack gap="400">
            <InlineStack
              align="space-between"
              blockAlign="center"
            >
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  Widget Activity
                </Text>

                <Text as="p" tone="subdued">
                  Customer interaction activity will appear here once
                  tracking is enabled.
                </Text>
              </BlockStack>

              <Badge tone="attention">Collecting data</Badge>
            </InlineStack>

            <Divider />

            <Box paddingBlock="600">
              <EmptyState
                heading="No analytics data yet"
                image=""
              >
                <Text as="p" tone="subdued">
                  Your analytics will appear here after customers begin
                  interacting with your WhatsApp widget.
                </Text>
              </EmptyState>
            </Box>
          </BlockStack>
        </Card>

        {/* What will be tracked */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Available Insights
                </Text>

                <Text as="p" tone="subdued">
                  Once interaction tracking is active, this section can
                  provide useful insights about your widget.
                </Text>

                <Divider />

                <BlockStack gap="300">
                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Widget clicks</Text>
                    <Badge>Coming with tracking</Badge>
                  </InlineStack>

                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Daily activity</Text>
                    <Badge>Coming with tracking</Badge>
                  </InlineStack>

                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Popular products</Text>
                    <Badge>Coming with tracking</Badge>
                  </InlineStack>

                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Customer interactions</Text>
                    <Badge>Coming with tracking</Badge>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Widget Status
                </Text>

                <Divider />

                <InlineStack
                  align="space-between"
                  blockAlign="center"
                >
                  <Text>Widget</Text>
                  <Badge tone="success">Configured</Badge>
                </InlineStack>

                <InlineStack
                  align="space-between"
                  blockAlign="center"
                >
                  <Text>Analytics</Text>
                  <Badge tone="attention">No data</Badge>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Information */}
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              About Analytics
            </Text>

            <Text as="p" tone="subdued">
              Analytics are designed to help you understand how customers
              use your WhatsApp widget. Data should only be displayed after
              real customer interactions have been recorded.
            </Text>
          </BlockStack>
        </Card>

      </BlockStack>
    </Page>
  );
}