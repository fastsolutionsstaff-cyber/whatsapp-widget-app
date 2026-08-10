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

// 6 Interactive Widget Icons
const WIDGET_ICONS = [
  {
    id: "whatsapp-classic",
    name: "Classic WhatsApp",
    svg: (color) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill={color} stroke="#ffffff" />
      </svg>
    ),
  },
  {
    id: "chat-dots",
    name: "Chat Bubble",
    svg: (color) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={color} stroke="#ffffff" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1" fill="#ffffff" />
        <circle cx="12" cy="10" r="1" fill="#ffffff" />
        <circle cx="15" cy="10" r="1" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "support-headset",
    name: "Support Agent",
    svg: (color) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill={color} />
        <path d="M6 12a6 6 0 0 1 12 0v4a2 2 0 0 1-2 2h-1v-4h3v-2a5 5 0 0 0-10 0v2h3v4H8a2 2 0 0 1-2-2v-4z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "business-badge",
    name: "Verified Business",
    svg: (color) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
        <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "phone-call",
    name: "Direct Call",
    svg: (color) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill={color} />
        <path d="M15.05 13.1c-.24-.24-.63-.24-.87 0l-1 1c-1.12-.58-2.08-1.54-2.66-2.66l1-1c.24-.24.24-.63 0-.87l-2-2c-.24-.24-.63-.24-.87 0l-1.2 1.2c-.4.4-.55.98-.38 1.52.88 2.8 3.12 5.04 5.92 5.92.54.17 1.12.02 1.52-.38l1.2-1.2c.24-.24.24-.63 0-.87l-2-2z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "send-message",
    name: "Instant Send",
    svg: (color) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
        <path d="M8 12l8-4-3 9-2-3-3-2z" fill="#ffffff" />
      </svg>
    ),
  },
];

// 1. Loader: Fetch existing WhatsApp settings from App Metafields
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
      phoneNumber: "923424593231",
      defaultMessage: "Hello! I have a question about your store.",
      widgetColor: "#25D366",
      position: "bottom-right",
      selectedIcon: "whatsapp-classic",
      greetingHeader: "Chat with us on WhatsApp",
      greetingSubtext: "We typically reply in a few minutes.",
      isEnabled: "true",
    };

    return json({
      settings: rawMetafield ? { ...defaultSettings, ...JSON.parse(rawMetafield) } : defaultSettings,
    });
  } catch (error) {
    console.error("Loader Error:", error);
    return json({
      settings: {
        phoneNumber: "923424593231",
        defaultMessage: "Hello! I have a question about your store.",
        widgetColor: "#25D366",
        position: "bottom-right",
        selectedIcon: "whatsapp-classic",
        greetingHeader: "Chat with us on WhatsApp",
        greetingSubtext: "We typically reply in a few minutes.",
        isEnabled: "true",
      },
    });
  }
};

// 2. Action: Save settings to App Metafields via GraphQL with robust error handling
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsPayload = {
    phoneNumber: formData.get("phoneNumber") || "",
    defaultMessage: formData.get("defaultMessage") || "",
    widgetColor: formData.get("widgetColor") || "#25D366",
    position: formData.get("position") || "bottom-right",
    selectedIcon: formData.get("selectedIcon") || "whatsapp-classic",
    greetingHeader: formData.get("greetingHeader") || "Chat with us on WhatsApp",
    greetingSubtext: formData.get("greetingSubtext") || "We typically reply in a few minutes.",
    isEnabled: "true",
  };

  try {
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
    const ownerId = appInstallData.data?.currentAppInstallation?.id;

    if (!ownerId) {
      return json({ status: "error", message: "App installation ID not found." }, { status: 400 });
    }

    // Set App Metafield
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
    console.error("Action save error:", error);
    return json({ status: "error", message: "Failed to save settings. Please try again." }, { status: 500 });
  }
};

// 3. UI Component with Realtime Sync & Live Preview
export default function Index() {
  const { settings: initialSettings } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();

  // Primary state initialization
  const [phoneNumber, setPhoneNumber] = useState(initialSettings.phoneNumber);
  const [defaultMessage, setDefaultMessage] = useState(initialSettings.defaultMessage);
  const [widgetColor, setWidgetColor] = useState(initialSettings.widgetColor);
  const [position, setPosition] = useState(initialSettings.position);
  const [selectedIcon, setSelectedIcon] = useState(initialSettings.selectedIcon || "whatsapp-classic");
  const [greetingHeader, setGreetingHeader] = useState(initialSettings.greetingHeader || "Chat with us on WhatsApp");
  const [greetingSubtext, setGreetingSubtext] = useState(initialSettings.greetingSubtext || "We typically reply in a few minutes.");
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if action returned new saved settings
  useEffect(() => {
    if (actionData?.status === "success" && actionData?.settings) {
      setPhoneNumber(actionData.settings.phoneNumber);
      setDefaultMessage(actionData.settings.defaultMessage);
      setWidgetColor(actionData.settings.widgetColor);
      setPosition(actionData.settings.position);
      setSelectedIcon(actionData.settings.selectedIcon);
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
    formData.append("selectedIcon", selectedIcon);
    formData.append("greetingHeader", greetingHeader);
    formData.append("greetingSubtext", greetingSubtext);

    submit(formData, { method: "post" });
  };

  const activeIconObj = WIDGET_ICONS.find((i) => i.id === selectedIcon) || WIDGET_ICONS[0];

  return (
    <Page
      title="WhatsApp Widget Settings"
      subtitle="Configure chat widget details and see real-time updates on preview."
      primaryAction={
        <Button primary loading={isSaving} onClick={handleSave}>
          Save Settings
        </Button>
      }
    >
      <BlockStack gap="500">
        {savedSuccess && (
          <Banner title="Settings saved successfully!" tone="success" />
        )}

        {actionData?.status === "error" && (
          <Banner title={actionData.message} tone="critical" />
        )}

        <Layout>
          {/* Main Configuration Controls */}
          <Layout.Section>
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Merchant Setup
                    </Text>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>

                  <TextField
                    label="WhatsApp Phone Number"
                    type="text"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="e.g. 923424593231 (Include country code without + or dashes)"
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
                </BlockStack>
              </Card>

              {/* Icon Picker & Style Customization */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Widget Style & Icon Selection
                  </Text>

                  <Text as="p" variant="bodySm">
                    Select Widget Icon:
                  </Text>

                  <Grid>
                    {WIDGET_ICONS.map((icon) => (
                      <Grid.Cell key={icon.id} columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2 }}>
                        <div
                          onClick={() => setSelectedIcon(icon.id)}
                          style={{
                            border: selectedIcon === icon.id ? `2px solid ${widgetColor}` : "1px solid #d2d6dc",
                            borderRadius: "10px",
                            padding: "10px 6px",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: selectedIcon === icon.id ? "#f4fbf7" : "#ffffff",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                            {icon.svg(widgetColor)}
                          </div>
                          <Text variant="bodyXs" as="span" alignment="center">
                            {icon.name}
                          </Text>
                        </div>
                      </Grid.Cell>
                    ))}
                  </Grid>

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

              {/* Additional Modal Customization */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Popup Greeting Customization
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

          {/* Right Column: Real-Time Preview Box */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    Live Preview
                  </Text>
                  <Badge tone="info">Real-Time</Badge>
                </InlineStack>

                <div
                  style={{
                    width: "100%",
                    height: "420px",
                    backgroundColor: "#f6f6f7",
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
                  {/* Top Store Bar Placeholder */}
                  <div style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "60px", height: "8px", backgroundColor: "#e1e3e5", borderRadius: "4px", marginBottom: "6px" }}></div>
                    <div style={{ width: "100px", height: "6px", backgroundColor: "#f1f2f3", borderRadius: "3px" }}></div>
                  </div>

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
                        <span style={{ color: "#ffffff" }}>{greetingHeader || "Chat with us"}</span>
                      </Text>
                      <p style={{ margin: "2px 0 0 0", fontSize: "11px", opacity: 0.9 }}>
                        {greetingSubtext || "We reply quickly"}
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
                        {defaultMessage || "Hello! How can we help?"}
                      </div>
                    </div>

                    <div style={{ padding: "8px 12px", backgroundColor: "#ffffff" }}>
                      <div
                        style={{
                          backgroundColor: widgetColor,
                          color: "#ffffff",
                          textAlign: "center",
                          padding: "8px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Start Chat
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Icon */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: position === "bottom-left" ? "16px" : "auto",
                      right: position === "bottom-right" ? "16px" : "auto",
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      backgroundColor: widgetColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    {activeIconObj.svg(widgetColor)}
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