import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation, useActionData } from "@remix-run/react";
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
  Badge,
  Grid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// 1. Loader: Always fetch FRESH Metafield data without caching
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
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
      phoneNumber: "14155552671",
      defaultMessage: "Hello! I have a question about your store.",
      widgetColor: "#25D366",
      position: "bottom-right",
      greetingHeader: "Customer Support",
      greetingSubtext: "Typically replies in a few minutes",
      isEnabled: "true",
    };

    const parsedSettings = rawMetafield ? JSON.parse(rawMetafield) : defaultSettings;

    // Prevent caching issue in Remix / Vercel
    return json(
      { settings: parsedSettings },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
    );
  } catch (error) {
    console.error("Loader Error:", error);
    return json({
      settings: {
        phoneNumber: "14155552671",
        defaultMessage: "Hello! I have a question about your store.",
        widgetColor: "#25D366",
        position: "bottom-right",
        greetingHeader: "Customer Support",
        greetingSubtext: "Typically replies in a few minutes",
        isEnabled: "true",
      },
    });
  }
};

// 2. Action: Save settings to App Metafield
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsPayload = {
    phoneNumber: formData.get("phoneNumber") || "",
    defaultMessage: formData.get("defaultMessage") || "",
    widgetColor: formData.get("widgetColor") || "#25D366",
    position: formData.get("position") || "bottom-right",
    greetingHeader: formData.get("greetingHeader") || "Customer Support",
    greetingSubtext: formData.get("greetingSubtext") || "Typically replies in a few minutes",
    isEnabled: "true",
  };

  try {
    const appInstallResponse = await admin.graphql(`
      #graphql
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appInstallData = await appInstallResponse.json();
    const ownerId = appInstallData.data?.currentAppInstallation?.id;

    if (!ownerId) {
      return json({ status: "error", message: "App installation ID not found." }, { status: 400 });
    }

    const mutationResponse = await admin.graphql(
      `
      #graphql
      mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            value
          }
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
      return json({ status: "error", message: errors[0].message }, { status: 400 });
    }

    return json({ status: "success", message: "Settings saved successfully!", settings: settingsPayload });
  } catch (error) {
    console.error("Action error:", error);
    return json({ status: "error", message: "Failed to save settings." }, { status: 500 });
  }
};

// 3. UI Component: Realtime Live Syncing
export default function Index() {
  const { settings: loadedSettings } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();

  // Active state initialized from loader
  const [phoneNumber, setPhoneNumber] = useState(loadedSettings.phoneNumber);
  const [defaultMessage, setDefaultMessage] = useState(loadedSettings.defaultMessage);
  const [widgetColor, setWidgetColor] = useState(loadedSettings.widgetColor);
  const [position, setPosition] = useState(loadedSettings.position);
  const [greetingHeader, setGreetingHeader] = useState(loadedSettings.greetingHeader);
  const [greetingSubtext, setGreetingSubtext] = useState(loadedSettings.greetingSubtext);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // EXACT FIX: Action save hotay hi Live state ko force update karo
  useEffect(() => {
    if (actionData?.status === "success" && actionData?.settings) {
      setPhoneNumber(actionData.settings.phoneNumber);
      setDefaultMessage(actionData.settings.defaultMessage);
      setWidgetColor(actionData.settings.widgetColor);
      setPosition(actionData.settings.position);
      setGreetingHeader(actionData.settings.greetingHeader);
      setGreetingSubtext(actionData.settings.greetingSubtext);

      setSavedSuccess(true);
      const timer = setTimeout(() => setSavedSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  const isSaving = navigation.state === "submitting";

  const handleSave = () => {
    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber);
    formData.append("defaultMessage", defaultMessage);
    formData.append("widgetColor", widgetColor);
    formData.append("position", position);
    formData.append("greetingHeader", greetingHeader);
    formData.append("greetingSubtext", greetingSubtext);

    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="WhatsApp Widget Settings"
      primaryAction={
        <Button primary loading={isSaving} onClick={handleSave}>
          Save Settings
        </Button>
      }
    >
      <BlockStack gap="500">
        {savedSuccess && <Banner title="Settings saved successfully!" tone="success" />}
        {actionData?.status === "error" && <Banner title={actionData.message} tone="critical" />}

        <Layout>
          {/* Controls Form */}
          <Layout.Section>
            <BlockStack gap="400">
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
                    autoComplete="off"
                  />
                  <TextField
                    label="Default Message Prefix"
                    type="text"
                    value={defaultMessage}
                    onChange={setDefaultMessage}
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Widget Style Customization
                  </Text>
                  <InlineStack gap="400" align="start" blockAlign="center">
                    <Box style={{ flexGrow: 1 }}>
                      <TextField
                        label="Button Accent Color"
                        type="color"
                        value={widgetColor}
                        onChange={setWidgetColor}
                        autoComplete="off"
                      />
                    </Box>
                    <Box style={{ paddingTop: "22px" }}>
                      <Badge>{widgetColor.toUpperCase()}</Badge>
                    </Box>
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
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Popup Customization
                  </Text>
                  <TextField
                    label="Greeting Header"
                    value={greetingHeader}
                    onChange={setGreetingHeader}
                    autoComplete="off"
                  />
                  <TextField
                    label="Greeting Subtext"
                    value={greetingSubtext}
                    onChange={setGreetingSubtext}
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Real-time Live Preview */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    Live Preview
                  </Text>
                  <Badge tone="info">Real-time Sync</Badge>
                </InlineStack>

                <div
                  style={{
                    width: "100%",
                    height: "380px",
                    backgroundColor: "#f1f2f4",
                    borderRadius: "12px",
                    border: "1px dashed #c9cccf",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* WhatsApp Popup Card */}
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      border: "1px solid #e1e3e5",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ backgroundColor: widgetColor, padding: "12px", color: "#ffffff" }}>
                      <Text variant="headingSm" as="h3">
                        <span style={{ color: "#ffffff" }}>{greetingHeader}</span>
                      </Text>
                      <p style={{ margin: "2px 0 0 0", fontSize: "11px", opacity: 0.9 }}>
                        {greetingSubtext}
                      </p>
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#efeae2" }}>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#303030",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          maxWidth: "85%",
                        }}
                      >
                        👋 {defaultMessage}
                      </div>
                    </div>

                    <div style={{ padding: "8px 12px", backgroundColor: "#ffffff" }}>
                      <div
                        style={{
                          backgroundColor: widgetColor,
                          color: "#ffffff",
                          textAlign: "center",
                          padding: "8px",
                          borderRadius: "12px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Start Chat
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Button */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: position === "bottom-left" ? "16px" : "auto",
                      right: position === "bottom-right" ? "16px" : "auto",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: widgetColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                        fill={widgetColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                <Button fullWidth primary loading={isSaving} onClick={handleSave}>
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