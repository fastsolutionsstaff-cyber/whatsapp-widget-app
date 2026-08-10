import { json } from "@remix-run/node";
import { Page, Layout, Card, Text, BlockStack, Divider } from "@shopify/polaris";

export const loader = async () => {
  return json({});
};

export default function TermsOfService() {
  return (
    <Page title="Terms of Service" subtitle="Last updated: August 10, 2026">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                1. Acceptance of Terms
              </Text>
              <Text variant="bodyMd" as="p">
                By installing or using our application, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not install or use the App.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                2. License to Use
              </Text>
              <Text variant="bodyMd" as="p-body">
                We grant you a limited, non-exclusive, non-transferable, revocable license to use our App on your Shopify store in accordance with these Terms and Shopify's App Store requirements.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                3. Modifications to the Service
              </Text>
              <Text variant="bodyMd" as="p">
                We reserve the right at any time to modify or discontinue, temporarily or permanently, the App (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the App.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                4. Limitation of Liability
              </Text>
              <Text variant="bodyMd" as="p">
                The App is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the App.
              </Text>

              <Divider />

              <Text variant="headingMd" as="h2">
                5. Support & Questions
              </Text>
              <Text variant="bodyMd" as="p">
                For any questions regarding these Terms of Service, please contact our support team at 
                <strong> support@fastsolution.com</strong>.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}