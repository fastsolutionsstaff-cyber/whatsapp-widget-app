import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, Text, Divider, Box } from "@shopify/polaris";

export const loader = async () => {
  return json({
    storeName: "Your Store Name",
    refundWindowDays: 30,
    contactEmail: "support@yourstore.com",
  });
};

export default function RefundPolicy() {
  const { storeName, refundWindowDays, contactEmail } = useLoaderData();

  return (
    <Page title="Refund Policy" backAction={{ content: "Back", url: "/" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              {/* Header Info */}
              <Box>
                <Text as="h1" variant="headingXl">
                  Refund Policy for {storeName}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Returns and Exchange Guidelines
                </Text>
              </Box>

              <Divider />

              {/* Section 1 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  1. Overview & Eligibility
                </Text>
                <Text as="p" variant="bodyMd">
                  We have a {refundWindowDays}-day return policy, which means you have {refundWindowDays} days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.
                </Text>
              </BlockStack>

              {/* Section 2 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  2. Non-Returnable Items
                </Text>
                <Text as="p" variant="bodyMd">
                  Certain types of items cannot be returned, like perishable goods, custom products (such as special orders or personalized items), and personal care goods. Please get in touch if you have questions or concerns about your specific item.
                </Text>
              </BlockStack>

              {/* Section 3 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  3. Refunds Process
                </Text>
                <Text as="p" variant="bodyMd">
                  Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment.
                </Text>
              </BlockStack>

              {/* Section 4 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  4. Shipping Costs for Returns
                </Text>
                <Text as="p" variant="bodyMd">
                  You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                </Text>
              </BlockStack>

              {/* Section 5 */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  5. Contact Us
                </Text>
                <Text as="p" variant="bodyMd">
                  If you have any questions regarding our refund policy, reach out to us at **{contactEmail}**.
                </Text>
              </BlockStack>

            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}