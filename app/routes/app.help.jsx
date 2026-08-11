import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Divider,
  TextField,
  Banner,
  Box,
  Modal,
} from "@shopify/polaris";
import { useState } from "react";

export default function Help() {
  const [search, setSearch] = useState("");
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const toggleSupportModal = () => setSupportModalOpen(!supportModalOpen);

  return (
    <Page
      title="Help & Support"
      subtitle="Everything you need to get your WhatsApp widget working smoothly."
    >
      <BlockStack gap="500">

        {/* Header */}
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingLg">
              How can we help?
            </Text>

            <Text as="p" tone="subdued">
              Find answers to common questions or contact our support team
              if you need additional assistance.
            </Text>

            <TextField
              label="Search help"
              labelHidden
              placeholder="Search for a question or topic..."
              value={search}
              onChange={setSearch}
              autoComplete="off"
              clearButton
              onClearButtonClick={() => setSearch("")}
            />
          </BlockStack>
        </Card>

        {/* Getting Started */}
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Getting Started
                  </Text>

                  <Text as="p" tone="subdued">
                    Follow these steps to get your WhatsApp widget live on
                    your Shopify storefront.
                  </Text>

                  <Divider />

                  <BlockStack gap="300">
                    <InlineStack gap="300" blockAlign="start">
                      <Text as="span" fontWeight="semibold">
                        01
                      </Text>

                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">
                          Configure your WhatsApp number
                        </Text>

                        <Text as="p" tone="subdued">
                          Open Customization and enter the WhatsApp number
                          your customers should contact.
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <InlineStack gap="300" blockAlign="start">
                      <Text as="span" fontWeight="semibold">
                        02
                      </Text>

                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">
                          Customize the widget
                        </Text>

                        <Text as="p" tone="subdued">
                          Choose your preferred icon, color, size, position
                          and greeting message.
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    <InlineStack gap="300" blockAlign="start">
                      <Text as="span" fontWeight="semibold">
                        03
                      </Text>

                      <BlockStack gap="100">
                        <Text as="h3" variant="headingSm">
                          Add it to your storefront
                        </Text>

                        <Text as="p" tone="subdued">
                          Use Shopify's Theme Editor to activate the WhatsApp
                          Widget app block.
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </BlockStack>

                  <Button variant="primary" url="/app/setup">
                    Open Setup Guide
                  </Button>
                </BlockStack>
              </Card>

              {/* FAQ */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Frequently Asked Questions
                  </Text>

                  <Divider />

                  <BlockStack gap="400">
                    <BlockStack gap="100">
                      <Text as="h3" variant="headingSm">
                        Why isn't my widget appearing?
                      </Text>

                      <Text as="p" tone="subdued">
                        Make sure the WhatsApp Widget app block has been
                        added and activated in your Shopify Theme Editor.
                      </Text>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="100">
                      <Text as="h3" variant="headingSm">
                        How do I change my WhatsApp number?
                      </Text>

                      <Text as="p" tone="subdued">
                        Open the Customization page, update your WhatsApp
                        number and save your settings.
                      </Text>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="100">
                      <Text as="h3" variant="headingSm">
                        Can I change the widget position?
                      </Text>

                      <Text as="p" tone="subdued">
                        Yes. Desktop and mobile positions can be configured
                        independently from the Customization page.
                      </Text>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="100">
                      <Text as="h3" variant="headingSm">
                        Can I customize the widget appearance?
                      </Text>

                      <Text as="p" tone="subdued">
                        Yes. You can customize the icon, accent color, size,
                        position and popup greeting.
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </BlockStack>
              </Card>

            </BlockStack>
          </Layout.Section>

          {/* Support Column */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Need more help?
                  </Text>

                  <Text as="p" tone="subdued">
                    If you can't find the answer you're looking for, our
                    support team can help you troubleshoot your setup.
                  </Text>

                  {/* Direct details visible on page */}
                  <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                    <BlockStack gap="100">
                      <Text as="p" fontWeight="semibold">Direct Support:</Text>
                      <Text as="p" tone="subdued">📧 info@fastsolutionsdeveloper.com</Text>
                      <Text as="p" tone="subdued">📞 +92 322 5981014</Text>
                    </BlockStack>
                  </Box>

                  <Button variant="primary" onClick={toggleSupportModal}>
                    Contact Support
                  </Button>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Quick Links
                  </Text>

                  <Divider />

                  <Button url="/app">
                    Customize Widget
                  </Button>

                  <Button url="/app/setup">
                    Setup Guide
                  </Button>

                  <Button url="/app/dashboard">
                    Dashboard
                  </Button>
                </BlockStack>
              </Card>

              <Banner tone="info">
                <p>
                  Before contacting support, make sure your widget is enabled
                  and activated in the Shopify Theme Editor.
                </p>
              </Banner>

            </BlockStack>
          </Layout.Section>
        </Layout>

        {/* Footer */}
        <Card>
          <Box padding="200">
            <InlineStack
              align="space-between"
              blockAlign="center"
              wrap={false}
            >
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  WhatsApp Widget
                </Text>

                <Text as="p" tone="subdued">
                  Simple, direct customer communication for your Shopify
                  store.
                </Text>
              </BlockStack>

              <Text as="span" tone="subdued">
                Support Center
              </Text>
            </InlineStack>
          </Box>
        </Card>

      </BlockStack>

      {/* Professional Contact Support Modal */}
      <Modal
        open={supportModalOpen}
        onClose={toggleSupportModal}
        title="Contact Fast Solutions Support"
        primaryAction={{
          content: 'Close',
          onAction: toggleSupportModal,
        }}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p">
              Our expert support team is ready to help you with any issues regarding your WhatsApp Widget setup, theme embedding, or configuration.
            </Text>
            
            <Card>
              <BlockStack gap="300">
                <BlockStack gap="100">
                  <Text as="h3" variant="headingSm">Email Support</Text>
                  <Text as="p" tone="subdued">Click the button below to open your mail app and send us a direct message:</Text>
                  <Button url="mailto:info@fastsolutionsdeveloper.com?subject=WhatsApp%20Widget%20Support" external>
                    Send Email (info@fastsolutionsdeveloper.com)
                  </Button>
                </BlockStack>

                <Divider />

                <BlockStack gap="100">
                  <Text as="h3" variant="headingSm">Phone / WhatsApp Support</Text>
                  <Text as="p" tone="subdued">Call or message us directly on WhatsApp:</Text>
                  <Button url="https://wa.me/923225981014" external>
                    Chat on WhatsApp (+92 322 5981014)
                  </Button>
                </BlockStack>
              </BlockStack>
            </Card>

            <Text as="p" tone="subdued" variant="bodySm">
              Working Hours: Monday – Saturday (9:00 AM – 6:00 PM PKT). We typically respond within 24 hours.
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>

    </Page>
  );
}