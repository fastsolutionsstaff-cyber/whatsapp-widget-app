import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, Grid } from "@shopify/polaris";

export async function loader() {
  return json({ totalClicks: 1248, activeChats: 342, conversionRate: "14.2%" });
}

export default function AnalyticsPage() {
  const { totalClicks, activeChats, conversionRate } = useLoaderData();

  return (
    <Page title="Widget Analytics" subtitle="Monitor your WhatsApp customer engagement metrics.">
      <Layout>
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4 }}>
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">Total Clicks</Text>
                  <Text variant="headingXl" as="p">{totalClicks}</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4 }}>
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">Active Chats</Text>
                  <Text variant="headingXl" as="p">{activeChats}</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4 }}>
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">Conversion Rate</Text>
                  <Text variant="headingXl" as="p">{conversionRate}</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}