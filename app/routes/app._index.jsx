import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Select,
  BlockStack,
  InlineStack,
  Text,
  Banner,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// 1. Loader: Fetch existing WhatsApp settings from App Metafields
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query getAppMetafields {
      currentAppInstallation {
        metafield(namespace: "whatsapp_widget", key: "settings") {
          value
        }
      }
    }
  `);

  const data = await response.json();
  const rawMetafield = data.data?.currentAppInstallation?.metafield?.value;

  const defaultSettings = {
    phoneNumber: "",
    defaultMessage: "Hello! I have a question about your store.",
    widgetColor: "#25D366",
    position: "bottom-right",
    isEnabled: "true",
  };

  return json({
    settings: rawMetafield ? JSON.parse(rawMetafield) : defaultSettings,
  });
};

// 2. Action: Save settings to App Metafields via GraphQL
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsPayload = {
    phoneNumber: formData.get("phoneNumber") || "",
    defaultMessage: formData.get("defaultMessage") || "",
    widgetColor: formData.get("widgetColor") || "#25D366",
    position: formData.get("position") || "bottom-right",
    isEnabled: formData.get("isEnabled") || "true",
  };

  // Get current App Installation ID
  const appInstallResponse = await admin.graphql(`
    #graphql
    query {
      currentAppInstallation {
        id
      }
    }
  `);
  const appInstallData = await appInstallResponse.json();
  const ownerId = appInstallData.data.currentAppInstallation.id;

  // Set App Metafield
  const mutationResponse = await admin.graphql(
    `
    #graphql
    mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        metafields: [
          {
            ownerId,
            namespace: "whatsapp_widget",
            key: "settings",
            type: "json",
            value: JSON.stringify(settingsPayload),
          },
        ],
      },
    }
  );

  const result = await mutationResponse.json();
  const errors = result.data?.metafieldsSet?.userErrors;

  if (errors && errors.length > 0) {
    return json({ status: "error", message: errors[0].message });
  }

  return json({ status: "success", message: "Settings saved successfully!" });
};

// 3. UI Component
export default function Index() {
  const { settings } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber);
  const [defaultMessage, setDefaultMessage] = useState(settings.defaultMessage);
  const [widgetColor, setWidgetColor] = useState(settings.widgetColor);
  const [position, setPosition] = useState(settings.position);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isSaving = navigation.state === "submitting";

  const handleSave = () => {
    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber);
    formData.append("defaultMessage", defaultMessage);
    formData.append("widgetColor", widgetColor);
    formData.append("position", position);

    submit(formData, { method: "post" });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <Page title="WhatsApp Widget Settings">
      <BlockStack gap="500">
        {savedSuccess && (
          <Banner title="Settings saved successfully!" tone="success" />
        )}

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Merchant Setup
                </Text>

                <TextField
                  label="WhatsApp Phone Number"
                  type="text"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="e.g. 14155552671 (Include country code without + or dashes)"
                  helpText="Customer messages will be routed to this number."
                  autoComplete="off"
                />

                <TextField
                  label="Default Message Prefix"
                  type="text"
                  value={defaultMessage}
                  onChange={setDefaultMessage}
                  helpText="Initial greeting before product details or page link are attached."
                  autoComplete="off"
                />

                <Text as="h2" variant="headingMd">
                  Widget Customization
                </Text>

                <InlineStack gap="400" align="start" blockAlign="center">
                  <Box>
                    <TextField
                      label="Button Color"
                      type="color"
                      value={widgetColor}
                      onChange={setWidgetColor}
                      autoComplete="off"
                    />
                  </Box>
                  <Text variant="bodySm">HEX: {widgetColor}</Text>
                </InlineStack>

                <Select
                  label="Widget Screen Position"
                  options={[
                    { label: "Bottom Right", value: "bottom-right" },
                    { label: "Bottom Left", value: "bottom-left" },
                  ]}
                  value={position}
                  onChange={setPosition}
                />

                <Button primary loading={isSaving} onClick={handleSave}>
                  Save Settings
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}