import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Divider,
  Banner,
  Badge,
} from "@shopify/polaris";
import { ExternalIcon, CheckCircleIcon, CodeIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  let shopDomain = "";
  
  try {
    const shopResponse = await admin.graphql(`
      #graphql
      query {
        shop {
          myshopifyDomain
        }
      }
    `);
    const shopData = await shopResponse.json();
    shopDomain = shopData.data?.shop?.myshopifyDomain || "";
  } catch (e) {
    shopDomain = "";
  }

  return json({ shopDomain });
};

export default function ProductWidgetGuidePage() {
  const { shopDomain } = useLoaderData();

  // Robust Theme Editor URL generation
  const cleanDomain = shopDomain ? shopDomain.replace(".myshopify.com", "") : "";
  const themeEditorUrl = cleanDomain 
    ? `https://admin.shopify.com/store/${cleanDomain}/themes/current/editor?template=product` 
    : "https://admin.shopify.com";

  return (
    <Page
      title="Product Page Widget Integration"
      subtitle="Embed the WhatsApp button directly below your Buy Buttons to skyrocket customer inquiries."
      primaryAction={
        <Button
          variant="primary"
          icon={ExternalIcon}
          url={themeEditorUrl}
          external
          size="large"
        >
          Open Theme Editor
        </Button>
      }
    >
      <BlockStack gap="500">
        <Banner tone="success" title="Ready to Boost Conversions?">
          <p>
            Adding the WhatsApp chat button directly on product pages helps resolve buyer hesitation instantly, leading to higher conversion rates.
          </p>
        </Banner>

        <Layout>
          {/* Left Main Section */}
          <Layout.Section>
            <BlockStack gap="500">
              {/* Step-by-Step Professional Guide */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">
                      📋 Step-by-Step Integration Guide
                    </Text>
                    <Badge tone="info">Takes less than 1 min</Badge>
                  </InlineStack>

                  <Divider />

                  <BlockStack gap="400">
                    {/* Step 1 */}
                    <InlineStack gap="400" align="start" blockAlign="start">
                      <Box
                        background="bg-surface-active"
                        padding="300"
                        borderRadius="200"
                        style={{ minWidth: "36px", textAlign: "center" }}
                      >
                        <Text variant="headingSm" as="span">1</Text>
                      </Box>
                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">Open the Theme Customizer</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Click the <strong>"Open Theme Editor"</strong> button above or in the sidebar. This will instantly launch your live Shopify theme editor on a product page view.
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <Divider />

                    {/* Step 2 */}
                    <InlineStack gap="400" align="start" blockAlign="start">
                      <Box
                        background="bg-surface-active"
                        padding="300"
                        borderRadius="200"
                        style={{ minWidth: "36px", textAlign: "center" }}
                      >
                        <Text variant="headingSm" as="span">2</Text>
                      </Box>
                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">Add the App Block</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          In the left sidebar of your theme editor, look under the <strong>Product Information</strong> section. Click <strong>Add block</strong> and select our WhatsApp widget.
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <Divider />

                    {/* Step 3 */}
                    <InlineStack gap="400" align="start" blockAlign="start">
                      <Box
                        background="bg-surface-active"
                        padding="300"
                        borderRadius="200"
                        style={{ minWidth: "36px", textAlign: "center" }}
                      >
                        <Text variant="headingSm" as="span">3</Text>
                      </Box>
                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">Position & Save Changes</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Drag and drop the block right underneath your <strong>Buy buttons (Add to Cart)</strong> element, configure text if needed, and hit <strong>Save</strong> in the top right corner.
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Right Sidebar Section */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    🚀 Quick Actions
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Jump straight into your store's theme editor to place the widget now.
                  </Text>
                  <Box paddingBlockStart="200">
                    <Button
                      variant="primary"
                      icon={ExternalIcon}
                      url={themeEditorUrl}
                      external
                      fullWidth
                    >
                      Open Product Template
                    </Button>
                  </Box>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    💡 Pro Benefits
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack gap="200" align="start">
                      <CheckCircleIcon width={20} fill="green" />
                      <Text as="p" variant="bodySm">Auto-detects current product name and link.</Text>
                    </InlineStack>
                    <InlineStack gap="200" align="start">
                      <CheckCircleIcon width={20} fill="green" />
                      <Text as="p" variant="bodySm">Zero impact on store loading speed.</Text>
                    </InlineStack>
                    <InlineStack gap="200" align="start">
                      <CheckCircleIcon width={20} fill="green" />
                      <Text as="p" variant="bodySm">Fully responsive across mobile & desktop.</Text>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}