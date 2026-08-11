import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Divider,
  ProgressBar,
  Box,
} from "@shopify/polaris";

export default function Dashboard() {
  return (
    <Page
      title="Dashboard"
      subtitle="Manage your WhatsApp customer experience from one place."
    >
      <BlockStack gap="500">

        {/* Welcome Header */}
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingLg">
              Welcome to WhatsApp Widget 👋
            </Text>

            <Text as="p" tone="subdued">
              Connect with your customers directly from your Shopify
              storefront using WhatsApp.
            </Text>

            <InlineStack gap="300">
              <Button variant="primary" url="/app">
                Customize Widget
              </Button>

              <Button url="/app/setup">
                Setup Guide
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Status Cards */}
        <Layout>
          <Layout.Section>
            <Layout>
              <Layout.Section>
                <Card>
                  <BlockStack gap="300">
                    <InlineStack
                      align="space-between"
                      blockAlign="center"
                    >
                      <Text as="h2" variant="headingMd">
                        Widget Status
                      </Text>

                      <Badge tone="success">Active</Badge>
                    </InlineStack>

                    <Text as="p" tone="subdued">
                      Your WhatsApp widget is ready to connect with
                      customers.
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card>
                  <BlockStack gap="300">
                    <InlineStack
                      align="space-between"
                      blockAlign="center"
                    >
                      <Text as="h2" variant="headingMd">
                        Storefront
                      </Text>

                      <Badge tone="success">Ready</Badge>
                    </InlineStack>

                    <Text as="p" tone="subdued">
                      Your widget can be added from the Shopify Theme Editor.
                    </Text>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
        </Layout>

        {/* Setup Progress */}
        <Card>
          <BlockStack gap="400">
            <InlineStack
              align="space-between"
              blockAlign="center"
            >
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  Setup Progress
                </Text>

                <Text as="p" tone="subdued">
                  Complete these steps to launch your WhatsApp widget.
                </Text>
              </BlockStack>

              <Text as="span" variant="bodyMd" fontWeight="semibold">
                75%
              </Text>
            </InlineStack>

            <ProgressBar progress={75} size="small" />

            <Divider />

            <BlockStack gap="300">
              <InlineStack
                align="space-between"
                blockAlign="center"
              >
                <Text>WhatsApp number configured</Text>
                <Badge tone="success">Completed</Badge>
              </InlineStack>

              <InlineStack
                align="space-between"
                blockAlign="center"
              >
                <Text>Widget customized</Text>
                <Badge tone="success">Completed</Badge>
              </InlineStack>

              <InlineStack
                align="space-between"
                blockAlign="center"
              >
                <Text>Widget added to storefront</Text>
                <Badge tone="success">Completed</Badge>
              </InlineStack>

              <InlineStack
                align="space-between"
                blockAlign="center"
              >
                <Text>Test customer experience</Text>
                <Badge tone="attention">Recommended</Badge>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Quick Actions */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Quick Actions
            </Text>

            <Text as="p" tone="subdued">
              Quickly access the most important parts of your WhatsApp
              widget.
            </Text>

            <Divider />

            <InlineStack gap="300" wrap>
              <Button url="/app">
                Customize Widget
              </Button>

              <Button url="/app/setup">
                Setup Guide
              </Button>

              <Button url="/app/analytics">
                View Analytics
              </Button>

              <Button url="/app/help">
                Help & Support
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Information */}
        <Card>
          <Box padding="200">
            <InlineStack
              align="space-between"
              blockAlign="center"
              wrap={false}
            >
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  Need help?
                </Text>

                <Text as="p" tone="subdued">
                  Visit our Help & Support section for setup instructions
                  and troubleshooting information.
                </Text>
              </BlockStack>

              <Button url="/app/help">
                Get Help
              </Button>
            </InlineStack>
          </Box>
        </Card>

      </BlockStack>
    </Page>
  );
}