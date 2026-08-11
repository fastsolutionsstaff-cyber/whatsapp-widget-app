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
} from "@shopify/polaris";
import { ExternalIcon, InfoIcon } from "@shopify/polaris-icons";
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

  const themeEditorUrl = shopDomain 
    ? `https://admin.shopify.com/store/${shopDomain.split('.')[0]}/themes/current/editor?template=product` 
    : "https://admin.shopify.com";

  return (
    <Page
      title="Product Page Widget Integration"
      subtitle="Learn how to display and manage the WhatsApp widget right below the Add to Cart button on your product pages."
    >
      <BlockStack gap="500">
        <Banner title="Native Theme Block Integration" tone="info" icon={InfoIcon}>
          <p>
            Our app uses Shopify’s modern Theme Blocks architecture. This ensures blazing-fast speed, zero layout shift, and seamless alignment right below your Add to Cart button.
          </p>
        </Banner>

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Quick Action Card */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    🚀 Quick Setup in Theme Editor
                  </Text>
                  <Text as="p" tone="subdued">
                    Click the button below to open your store's product template directly in the Shopify Theme Customizer.
                  </Text>
                  <Box>
                    <Button
                      variant="primary"
                      size="large"
                      icon={ExternalIcon}
                      url={themeEditorUrl}
                      external
                    >
                      Open Product Template in Theme Editor
                    </Button>
                  </Box>
                </BlockStack>
              </Card>

              {/* Step-by-Step Instructions */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Step-by-Step Instructions
                  </Text>

                  <BlockStack gap="300">
                    <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">1. Navigate to Product Information</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          In the theme editor sidebar, look for the **Product Information** section under your Product template.
                        </Text>
                      </BlockStack>
                    </Box>

                    <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">2. Add App Block</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Click on **Add block** inside the Product Information section and select our WhatsApp Add-to-Cart widget block.
                        </Text>
                      </BlockStack>
                    </Box>

                    <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">3. Position & Save</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Drag and drop the block right below your **Buy buttons** (Add to Cart) element, customize its text or color, and click **Save**.
                        </Text>
                      </BlockStack>
                    </Box>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar / Tips */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    💡 Why Theme Blocks?
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Placing widgets directly through Shopify blocks ensures it dynamically detects the current product's name, image, and link, allowing customers to chat with you about a specific item instantly!
                  </Text>
                  <Divider />
                  <Button url={themeEditorUrl} external plain>
                    Go to Editor →
                  </Button>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}