import { json } from "@remix-run/node";
import { Page, Layout, Card, Text, BlockStack, Divider } from "@shopify/polaris";

export const loader = async () => {
  return json({});
};

export default function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy" subtitle="Last updated: August 10, 2026">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Overview
              </Text>
              <Text variant="bodyMd" as="p">
                This Privacy Policy describes how your personal information is collected, used, and shared when you install or use our application ("App") within your Shopify store. We are committed to protecting your privacy and ensuring your store data remains secure.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                1. Personal Information We Collect
              </Text>
              <Text variant="bodyMd" as="p">
                When you install the App, we automatically access certain types of information from your Shopify account as required to provide core features (such as widget configurations, phone numbers, and design preferences):
              </Text>
              <Text variant="bodyMd" as="p">
                • Store domain and basic shop metadata.<br />
                • Merchant email address associated with the store installation.<br />
                • App settings and metafield configurations saved through our dashboard.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                2. How We Use Your Information
              </Text>
              <Text variant="bodyMd" as="p">
                We use the information we collect to operate, maintain, provide, and improve the features of the App. We do not sell, rent, or trade your store data or customer information to third parties.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                3. Data Security & Retention
              </Text>
              <Text variant="bodyMd" as="p">
                We follow industry-standard practices to protect your data. When you uninstall our App, all your configurations stored via app metafields are safely handled in compliance with Shopify guidelines.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                4. Contact Information
              </Text>
              <Text variant="bodyMd" as="p">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us at: 
                <strong> support@fastsolution.com</strong>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}