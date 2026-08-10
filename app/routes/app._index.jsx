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
  ButtonGroup,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// 6 Unique & Attractive SVG Icons
const UNIQUE_ICONS = [
  {
    id: "whatsapp-classic",
    name: "Classic WA",
    render: (color, sizeScale = 1) => (
      <svg width={28 * sizeScale} height={28 * sizeScale} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
        <path d="M17.5 14.3c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1s-.8 1-.9 1.2c-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.2-.5s0-.4-.1-.5c-.1-.1-.7-1.7-.9-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.6-.3z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "agent-headset",
    name: "Live Support",
    render: (color, sizeScale = 1) => (
      <svg width={28 * sizeScale} height={28 * sizeScale} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill={color} />
        <path d="M12 6a6 6 0 00-6 6v3.5A2.5 2.5 0 008.5 18H9v-5H7.5v-1a4.5 4.5 0 119 0v1H15v5h.5a2.5 2.5 0 002.5-2.5V12a6 6 0 00-6-6z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "paper-plane",
    name: "Instant Send",
    render: (color, sizeScale = 1) => (
      <svg width={28 * sizeScale} height={28 * sizeScale} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
        <path d="M8 12l8-4-3 9-2-3-3-2z" fill="#ffffff" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "sparkle-chat",
    name: "Smart Chat",
    render: (color, sizeScale = 1) => (
      <svg width={28 * sizeScale} height={28 * sizeScale} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="8" fill={color} />
        <path d="M7 8h10M7 12h7m-7 4h4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="15" r="1.5" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "badge-verified",
    name: "Official Badge",
    render: (color, sizeScale = 1) => (
      <svg width={28 * sizeScale} height={28 * sizeScale} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
        <path d="M8.5 12.5l2.5 2.5 5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "wave-message",
    name: "Direct Wave",
    render: (color, sizeScale = 1) => (
      <svg width={28 * sizeScale} height={28 * sizeScale} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
        <path d="M7 12a2 2 0 012-2h6a2 2 0 012 2v3a2 2 0 01-2 2h-2l-3 2v-2H9a2 2 0 01-2-2v-3z" fill="#ffffff" />
      </svg>
    ),
  },
];

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
      selectedIcon: "whatsapp-classic",
      position: "bottom-right",
      widgetSize: "medium", // small, medium, large
      greetingHeader: "Chat with us on WhatsApp",
      greetingSubtext: "We typically reply in a few minutes.",
      isEnabled: "true",
    };

    return json(
      { settings: rawMetafield ? { ...defaultSettings, ...JSON.parse(rawMetafield) } : defaultSettings },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
    );
  } catch (error) {
    return json({
      settings: {
        phoneNumber: "923424593231",
        defaultMessage: "Hello! I have a question about your store.",
        widgetColor: "#25D366",
        selectedIcon: "whatsapp-classic",
        position: "bottom-right",
        widgetSize: "medium",
        greetingHeader: "Chat with us on WhatsApp",
        greetingSubtext: "We typically reply in a few minutes.",
        isEnabled: "true",
      },
    });
  }
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsPayload = {
    phoneNumber: formData.get("phoneNumber") || "",
    defaultMessage: formData.get("defaultMessage") || "",
    widgetColor: formData.get("widgetColor") || "#25D366",
    selectedIcon: formData.get("selectedIcon") || "whatsapp-classic",
    position: formData.get("position") || "bottom-right",
    widgetSize: formData.get("widgetSize") || "medium",
    greetingHeader: formData.get("greetingHeader") || "Chat with us on WhatsApp",
    greetingSubtext: formData.get("greetingSubtext") || "We typically reply in a few minutes.",
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
    return json({ status: "error", message: "Failed to save settings." }, { status: 500 });
  }
};

export default function Index() {
  const { settings: loadedSettings } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState(loadedSettings.phoneNumber);
  const [defaultMessage, setDefaultMessage] = useState(loadedSettings.defaultMessage);
  const [widgetColor, setWidgetColor] = useState(loadedSettings.widgetColor);
  const [selectedIcon, setSelectedIcon] = useState(loadedSettings.selectedIcon || "whatsapp-classic");
  const [position, setPosition] = useState(loadedSettings.position);
  const [widgetSize, setWidgetSize] = useState(loadedSettings.widgetSize || "medium");
  const [greetingHeader, setGreetingHeader] = useState(loadedSettings.greetingHeader);
  const [greetingSubtext, setGreetingSubtext] = useState(loadedSettings.greetingSubtext);

  // Device view toggle state (desktop | mobile)
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (actionData?.status === "success" && actionData?.settings) {
      setPhoneNumber(actionData.settings.phoneNumber);
      setDefaultMessage(actionData.settings.defaultMessage);
      setWidgetColor(actionData.settings.widgetColor);
      setSelectedIcon(actionData.settings.selectedIcon);
      setPosition(actionData.settings.position);
      setWidgetSize(actionData.settings.widgetSize);
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
    formData.append("selectedIcon", selectedIcon);
    formData.append("position", position);
    formData.append("widgetSize", widgetSize);
    formData.append("greetingHeader", greetingHeader);
    formData.append("greetingSubtext", greetingSubtext);

    submit(formData, { method: "post" });
  };

  const activeIconObj = UNIQUE_ICONS.find((item) => item.id === selectedIcon) || UNIQUE_ICONS[0];

  // Dynamic Pixel dimensions based on size selection
  const getSizeConfig = () => {
    switch (widgetSize) {
      case "small":
        return { btnSize: 46, iconScale: 0.8, popupWidth: 260 };
      case "large":
        return { btnSize: 64, iconScale: 1.2, popupWidth: 320 };
      default: // medium
        return { btnSize: 54, iconScale: 1, popupWidth: 285 };
    }
  };

  const sizeCfg = getSizeConfig();

  return (
    <Page
      title="WhatsApp Widget Pro Settings"
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
          <Layout.Section>
            <BlockStack gap="400">
              {/* Merchant Setup */}
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

              {/* Style & Size Customization */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Widget Style & Sizing
                  </Text>

                  {/* 6 Icons Selection */}
                  <Text as="p" variant="bodySm" fontWeight="medium">
                    Select Unique Icon Style:
                  </Text>
                  <Grid>
                    {UNIQUE_ICONS.map((icon) => (
                      <Grid.Cell key={icon.id} columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2 }}>
                        <div
                          onClick={() => setSelectedIcon(icon.id)}
                          style={{
                            border: selectedIcon === icon.id ? `2px solid ${widgetColor}` : "1px solid #d2d6dc",
                            borderRadius: "10px",
                            padding: "8px 4px",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: selectedIcon === icon.id ? "#f4fbf7" : "#ffffff",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                            {icon.render(widgetColor)}
                          </div>
                          <Text variant="bodyXs" as="span" alignment="center">
                            {icon.name}
                          </Text>
                        </div>
                      </Grid.Cell>
                    ))}
                  </Grid>

                  {/* Size & Color Inputs Row */}
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <Select
                        label="Widget Size"
                        options={[
                          { label: "Small (46px)", value: "small" },
                          { label: "Medium Default (54px)", value: "medium" },
                          { label: "Large (64px)", value: "large" },
                        ]}
                        value={widgetSize}
                        onChange={setWidgetSize}
                      />
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <Select
                        label="Screen Position"
                        options={[
                          { label: "Bottom Right", value: "bottom-right" },
                          { label: "Bottom Left", value: "bottom-left" },
                        ]}
                        value={position}
                        onChange={setPosition}
                      />
                    </Grid.Cell>
                  </Grid>

                  <InlineStack gap="300" align="start" blockAlign="end">
                    <Box style={{ width: "110px" }}>
                      <TextField
                        label="Accent Color"
                        type="color"
                        value={widgetColor}
                        onChange={setWidgetColor}
                        autoComplete="off"
                      />
                    </Box>
                    <Box style={{ paddingBottom: "8px" }}>
                      <Badge tone="info">{widgetColor.toUpperCase()}</Badge>
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Popup Customization */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Popup Header Customization
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

          {/* Right Column: Interactive Device Live Preview */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Live Preview
                  </Text>
                  {/* Desktop / Mobile Switcher */}
                  <ButtonGroup segmented>
                    <Button
                      pressed={previewDevice === "desktop"}
                      onClick={() => setPreviewDevice("desktop")}
                      size="micro"
                    >
                      Desktop
                    </Button>
                    <Button
                      pressed={previewDevice === "mobile"}
                      onClick={() => setPreviewDevice("mobile")}
                      size="micro"
                    >
                      Mobile
                    </Button>
                  </ButtonGroup>
                </InlineStack>

                {/* Device Frame */}
                <div
                  style={{
                    width: "100%",
                    height: "420px",
                    backgroundColor: "#f4f5f7",
                    borderRadius: "16px",
                    border: "2px solid #e1e3e5",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Outer Screen Simulation (Mobile mockup wrapper if mobile selected) */}
                  <div
                    style={{
                      width: previewDevice === "mobile" ? "240px" : "100%",
                      height: previewDevice === "mobile" ? "390px" : "100%",
                      backgroundColor: "#ffffff",
                      borderRadius: previewDevice === "mobile" ? "24px" : "8px",
                      border: previewDevice === "mobile" ? "8px solid #1a1a1a" : "1px solid #dfe3e8",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "12px",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Simulated Header */}
                    <div style={{ height: "12px", backgroundColor: "#f0f2f5", borderRadius: "4px", width: "40%" }} />

                    {/* WhatsApp Chat Popup Window */}
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        border: "1px solid #e1e3e5",
                        overflow: "hidden",
                        width: previewDevice === "mobile" ? "100%" : `${sizeCfg.popupWidth - 20}px`,
                        alignSelf: position === "bottom-left" ? "flex-start" : "flex-end",
                      }}
                    >
                      <div style={{ backgroundColor: widgetColor, padding: "8px 10px", color: "#ffffff" }}>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: "bold", color: "#ffffff" }}>
                          {greetingHeader}
                        </p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "9px", opacity: 0.9 }}>
                          {greetingSubtext}
                        </p>
                      </div>

                      <div style={{ padding: "8px", backgroundColor: "#efeae2" }}>
                        <div
                          style={{
                            backgroundColor: "#ffffff",
                            padding: "6px 8px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            color: "#303030",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            maxWidth: "90%",
                          }}
                        >
                          👋 {defaultMessage}
                        </div>
                      </div>

                      <div style={{ padding: "6px 8px", backgroundColor: "#ffffff" }}>
                        <div
                          style={{
                            backgroundColor: widgetColor,
                            color: "#ffffff",
                            textAlign: "center",
                            padding: "6px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "10px",
                          }}
                        >
                          Start Chat
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Floating Button */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: position === "bottom-left" ? "10px" : "auto",
                        right: position === "bottom-right" ? "10px" : "auto",
                        width: `${sizeCfg.btnSize}px`,
                        height: `${sizeCfg.btnSize}px`,
                        borderRadius: "50%",
                        backgroundColor: widgetColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {activeIconObj.render(widgetColor, sizeCfg.iconScale)}
                    </div>
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