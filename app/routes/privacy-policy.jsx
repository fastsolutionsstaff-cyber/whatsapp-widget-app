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

export default function PrivacyPolicy() {
  const { storeName, lastUpdated, contactEmail } = useLoaderData();

  return (
    <Page title="Privacy Policy" backAction={{ content: "Back", url: "/" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              {/* Header Info */}
              <Box>
                <Text as="h1" variant="headingXl">
                  Privacy Policy for {storeName}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Last updated: {lastUpdated}
                </Text>
              </Box>

              <Divider />

              {/* Section 1 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  1. Introduction
                </Text>
                <Text as="p" variant="bodyMd">
                  Welcome to {storeName}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                </Text>
              </BlockStack>

              {/* Section 2 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  2. Data We Collect About You
                </Text>
                <Text as="p" variant="bodyMd">
                  Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </Text>
                <Text as="p" variant="bodyMd">
                  * **Identity Data:** includes first name, last name, username or similar identifier.
                </Text>
                <Text as="p" variant="bodyMd">
                  * **Contact Data:** includes billing address, delivery address, email address, and telephone numbers.
                </Text>
                <Text as="p" variant="bodyMd">
                  * **Technical Data:** includes internet protocol (IP) address, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.
                </Text>
              </BlockStack>

              {/* Section 3 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  3. How We Use Your Data
                </Text>
                <Text as="p" variant="bodyMd">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </Text>
                <Text as="p" variant="bodyMd">
                  * Where we need to perform the contract we are about to enter into or have entered into with you.
                </Text>
                <Text as="p" variant="bodyMd">
                  * Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
                </Text>
                <Text as="p" variant="bodyMd">
                  * Where we need to comply with a legal obligation.
                </Text>
              </BlockStack>

              {/* Section 4 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  4. Data Security
                </Text>
                <Text as="p" variant="bodyMd">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                </Text>
              </BlockStack>

              {/* Section 5 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  5. Contact Us
                </Text>
                <Text as="p" variant="bodyMd">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at: **{contactEmail}**.
                </Text>
              </BlockStack>

            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}