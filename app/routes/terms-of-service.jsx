import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, Text, Divider, Box } from "@shopify/polaris";

export const loader = async () => {
  return json({
    storeName: "Your Store Name",
    lastUpdated: "August 10, 2026",
    contactEmail: "support@yourstore.com",
  });
};

export default function TermsOfService() {
  const { storeName, lastUpdated, contactEmail } = useLoaderData();

  return (
    <Page title="Terms of Service" backAction={{ content: "Back", url: "/" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              {/* Header Info */}
              <Box>
                <Text as="h1" variant="headingXl">
                  Terms of Service for {storeName}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Last updated: {lastUpdated}
                </Text>
              </Box>

              <Divider />

              {/* Section 1 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  1. Overview
                </Text>
                <Text as="p" variant="bodyMd">
                  This website is operated by {storeName}. Throughout the site, the terms "we", "us" and "our" refer to {storeName}. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.
                </Text>
              </BlockStack>

              {/* Section 2 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  2. Online Store Terms
                </Text>
                <Text as="p" variant="bodyMd">
                  By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you violate any laws in your jurisdiction.
                </Text>
              </BlockStack>

              {/* Section 3 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  3. General Conditions
                </Text>
                <Text as="p" variant="bodyMd">
                  We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.
                </Text>
              </BlockStack>

              {/* Section 4 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  4. Modifications to the Service and Prices
                </Text>
                <Text as="p" variant="bodyMd">
                  Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                </Text>
              </BlockStack>

              {/* Section 5 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  5. Contact Information
                </Text>
                <Text as="p" variant="bodyMd">
                  Questions about the Terms of Service should be sent to us at **{contactEmail}**.
                </Text>
              </BlockStack>

            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}