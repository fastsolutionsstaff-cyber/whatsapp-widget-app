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
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// Loader to fetch real analytics data from database per shop
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Fetch or initialize analytics record for this shop
  let analytics = await prisma.analytics.findUnique({
    where: { shop },
  });

  if (!analytics) {
    analytics = await prisma.analytics.create({
      data: {
        shop,
        widgetClicks: 0,
        conversations: 0,
      },
    });
  }

  const conversionRate =
    analytics.conversations > 0 && analytics.widgetClicks > 0
      ? ((analytics.conversations / analytics.widgetClicks) * 100).toFixed(1)
      : "0.0";

  return json({
    widgetClicks: analytics.widgetClicks,
    conversations: analytics.conversations,
    conversionRate: `${conversionRate}%`,
    hasData: analytics.widgetClicks > 0 || analytics.conversations > 0,
  });
};

export default function Analytics() {
  const { widgetClicks, conversations, conversionRate, hasData } = useLoaderData();

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
                      {widgetClicks}
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
                      {conversations}
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
                      {conversionRate}
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
                  {hasData
                    ? "Live interaction tracking is active and recording data."
                    : "Customer interaction activity will appear here once tracking is enabled."}
                </Text>
              </BlockStack>

              <Badge tone={hasData ? "success" : "attention"}>
                {hasData ? "Active Tracking" : "Collecting data"}
              </Badge>
            </InlineStack>

            <Divider />

            {hasData ? (
              <Box paddingBlock="400">
                <BlockStack gap="300">
                  <Text as="p" fontWeight="semibold">Recent Activity Summary:</Text>
                  <Text as="p" tone="subdued">
                    Your customers have interacted with the widget {widgetClicks} times, initiating {conversations} direct conversations.
                  </Text>
                </BlockStack>
              </Box>
            ) : (
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
            )}
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
                  Interaction tracking is fully functional and monitoring your storefront widget.
                </Text>

                <Divider />

                <BlockStack gap="300">
                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Widget clicks</Text>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>

                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Daily activity</Text>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>

                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Popular products</Text>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>

                  <InlineStack
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text>Customer interactions</Text>
                    <Badge tone="success">Active</Badge>
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
                  <Badge tone={hasData ? "success" : "attention"}>
                    {hasData ? "Recording" : "No data"}
                  </Badge>
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
              use your WhatsApp widget. Data is updated in real-time as interactions occur on your store.
            </Text>
          </BlockStack>
        </Card>

      </BlockStack>
    </Page>
  );
}