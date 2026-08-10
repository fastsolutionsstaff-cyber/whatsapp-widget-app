import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  InlineStack,
  Banner,
  Badge,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function AdditionalPage() {
  return (
    <Page>
      <TitleBar title="User Guide & Integration" />
      
      <BlockStack gap="500">
        <Banner title="App Block Ready" tone="info">
          To display the WhatsApp widget on your storefront, make sure to enable the App Embed/Block inside your Shopify Theme Editor.
        </Banner>

        <Layout>
          {/* Main Content: Step-by-Step Setup */}
          <Layout.Section>
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    How to Enable Widget on Storefront
                  </Text>
                  
                  <List type="number">
                    <List.Item>
                      Go to your <strong>Shopify Admin</strong> &gt; <strong>Online Store</strong> &gt; <strong>Themes</strong>.
                    </List.Item>
                    <List.Item>
                      Click the <strong>Customize</strong> button next to your active theme.
                    </List.Item>
                    <List.Item>
                      In the Theme Editor left sidebar, navigate to <strong>App Embeds</strong> (or click <strong>Add Block</strong> on Product Pages).
                    </List.Item>
                    <List.Item>
                      Search for <strong>WhatsApp Inline Widget</strong>, toggle it <strong>ON</strong>, and click <strong>Save</strong> at the top right.
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Frequently Asked Questions (FAQ)
                  </Text>
                  
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">
                      Q: Does this affect my store's loading speed?
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      No, the widget script is lightweight and loads asynchronously, ensuring zero impact on your store's core web vitals.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">
                      Q: How are customer chats handled?
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      When a customer clicks the widget, it opens their native WhatsApp or WhatsApp Web with your preset message and product details attached.
                    </Text>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar: App Status & Support */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Integration Status
                  </Text>
                  
                  <InlineStack align="space-between">
                    <Text variant="bodyMd">App Version</Text>
                    <Badge tone="success">v1.2.0 (Commercial)</Badge>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text variant="bodyMd">Extension</Text>
                    <Badge tone="info">Inline Block</Badge>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text variant="bodyMd">Config Metafield</Text>
                    <Code>whatsapp_widget</Code>
                  </InlineStack>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Need Developer Help?
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    If you face any issues during setup or need custom theme positioning, feel free to contact our support team.
                  </Text>
                  
                  <Link url="mailto:support@fastsolutions.com" removeUnderline>
                    Contact Merchant Support
                  </Link>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}