import React from 'react';
import { Page, Layout, Card, BlockStack, Text, Divider } from "@shopify/polaris";

export default function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <div>
                <Text variant="headingXl" as="h1">Widget-WhatsApp Privacy Policy</Text>
                <Text variant="bodySm" tone="subdued">Last updated: August 12, 2026</Text>
              </div>

              <Divider />

              <BlockStack gap="300">
                <Text variant="bodyMd" as="p">
                  Widget-WhatsApp ("we", "our", or "us") operates the Widget-WhatsApp Shopify application (the "Service"). This page informs merchants and store visitors of our policies regarding the collection, use, and disclosure of personal data when using our Service.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">1. Information Collection & App Functionality</Text>
                <Text variant="bodyMd" as="p">
                  To provide a seamless WhatsApp live chat experience across your store, our application integrates directly into your <strong>storefront, product pages, and cart pages</strong>. We only process the minimum technical data required to render the chat widget correctly. We do not store, log, or process sensitive personal customer data on our external servers, as all chat interactions happen directly through WhatsApp's official communication channels.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">2. Data Security & Compliance</Text>
                <Text variant="bodyMd" as="p">
                  We prioritize the security of your store data. Standard technical safeguards are implemented to protect the integrity of our application, ensuring a safe and reliable integration with your Shopify admin and storefront.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">3. Changes to This Privacy Policy</Text>
                <Text variant="bodyMd" as="p">
                  We may update our Privacy Policy periodically to reflect enhancements in our app features or compliance updates. Any modifications will be posted directly on this page.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">4. Contact Us</Text>
                <Text variant="bodyMd" as="p">
                  If you have any questions, feedback, or concerns regarding this Privacy Policy or our WhatsApp integration app, please reach out to our development support channel.
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}