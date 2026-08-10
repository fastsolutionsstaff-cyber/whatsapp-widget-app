import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, Text, Divider, Box, TextField, Button } from "@shopify/polaris";
import { useState } from "react";

export const loader = async () => {
  return json({
    storeName: "Your Store Name",
    supportEmail: "support@yourstore.com",
    supportPhone: "+1 (555) 123-4567",
  });
};

export default function ContactUs() {
  const { storeName, supportEmail, supportPhone } = useLoaderData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Yahan aap apna form submission logic ya action implement kar sakte hain
  };

  return (
    <Page title="Contact Us" backAction={{ content: "Back", url: "/" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              {/* Header Info */}
              <Box>
                <Text as="h1" variant="headingXl">
                  Get in Touch with {storeName}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  We are here to help and answer any question you might have.
                </Text>
              </Box>

              <Divider />

              {/* Contact Info Details */}
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Direct Support Channels
                </Text>
                <Text as="p" variant="bodyMd">
                  * **Email Support:** {supportEmail}
                </Text>
                <Text as="p" variant="bodyMd">
                  * **Phone Helpline:** {supportPhone}
                </Text>
                <Text as="p" variant="bodyMd">
                  * **Working Hours:** Monday – Friday (9:00 AM – 6:00 PM)
                </Text>
              </BlockStack>

              <Divider />

              {/* Contact Form */}
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Send Us a Message
                </Text>

                {submitted ? (
                  <Box style={{ backgroundColor: "#f4fbf7", padding: "16px", borderRadius: "8px", border: "1px solid #cce8d9" }}>
                    <Text as="p" variant="bodyMd" tone="success">
                      Thank you for reaching out! We have received your message and will get back to you shortly.
                    </Text>
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <BlockStack gap="400">
                      <TextField
                        label="Your Name"
                        value={name}
                        onChange={setName}
                        autoComplete="name"
                        required
                      />
                      <TextField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        autoComplete="email"
                        required
                      />
                      <TextField
                        label="Message"
                        value={message}
                        onChange={setMessage}
                        multiline={4}
                        autoComplete="off"
                        required
                      />
                      <Box>
                        <Button primary submit>
                          Submit Message
                        </Button>
                      </Box>
                    </BlockStack>
                  </form>
                )}
              </BlockStack>

            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}