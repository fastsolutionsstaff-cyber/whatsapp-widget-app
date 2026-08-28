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
  RangeSlider,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// ============================================================
// ICON CONFIGURATION
// ============================================================

const UNIQUE_ICONS = [
  {
    id: "whatsapp-classic",
    name: "Classic WA",
    render: (color, sizePx = 54) => {
      const iconSize = Math.round(sizePx * 0.52);
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} />
          <path
            d="M17.5 14.3c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1s-.8 1-.9 1.2c-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.2-.5s0-.4-.1-.5c-.1-.1-.7-1.7-.9-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.6-.3z"
            fill="#ffffff"
          />
        </svg>
      );
    },
  },
  {
    id: "agent-headset",
    name: "Live Support",
    render: (color, sizePx = 54) => {
      const iconSize = Math.round(sizePx * 0.52);
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" fill={color} />
          <path
            d="M12 6a6 6 0 00-6 6v3.5A2.5 2.5 0 008.5 18H9v-5H7.5v-1a4.5 4.5 0 119 0v1H15v5h.5a2.5 2.5 0 002.5-2.5V12a6 6 0 00-6-6z"
            fill="#ffffff"
          />
        </svg>
      );
    },
  },
  {
    id: "paper-plane",
    name: "Instant Send",
    render: (color, sizePx = 54) => {
      const iconSize = Math.round(sizePx * 0.52);
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} />
          <path
            d="M8 12l8-4-3 9-2-3-3-2z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
  {
    id: "sparkle-chat",
    name: "Smart Chat",
    render: (color, sizePx = 54) => {
      const iconSize = Math.round(sizePx * 0.52);
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="8" fill={color} />
          <path
            d="M7 8h10M7 12h7m-7 4h4"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="17" cy="15" r="1.5" fill="#ffffff" />
        </svg>
      );
    },
  },
  {
    id: "badge-verified",
    name: "Official Badge",
    render: (color, sizePx = 54) => {
      const iconSize = Math.round(sizePx * 0.52);
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} />
          <path
            d="M8.5 12.5l2.5 2.5 5-5"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
  {
    id: "custom-upload",
    name: "Custom Image",
    render: (color, sizePx = 54, customUrl = "") => {
      const iconSize = Math.round(sizePx * 0.52);
      if (customUrl) {
        return (
          <img
            src={customUrl}
            alt="Custom Icon"
            style={{ width: iconSize, height: iconSize, objectFit: "contain" }}
          />
        );
      }
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" fill={color} />
          <path d="M12 8v8m-4-4h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    },
  },
];

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
  phoneNumber: "923424593231",
  defaultMessage: "Hello! I have a question about your store.",
  widgetColor: "#25D366",
  selectedIcon: "whatsapp-classic",
  customIconUrl: "",
  position: "bottom-right",
  widgetSizePx: 56,
  mobilePosition: "bottom-right",
  mobileWidgetSizePx: 48,
  greetingHeader: "Chat with us on WhatsApp",
  greetingSubtext: "We typically reply in a few minutes.",
};

// ============================================================
// LOADER
// ============================================================

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  let planInfo = { plan: "starter-plan", clickCount: 0 };

  // Fetch subscription status
  try {
    const subResponse = await admin.graphql(`
      #graphql
      query {
        currentAppInstallation {
          activeSubscriptions {
            name
            status
          }
        }
      }
    `);
    const subData = await subResponse.json();
    const activeSubs = subData.data?.currentAppInstallation?.activeSubscriptions || [];
    const hasProSubscription = activeSubs.some(
      (sub) => sub.status === "ACTIVE" && sub.name.toLowerCase().includes("pro")
    );
    const currentPlan = hasProSubscription ? "pro-plan" : "starter-plan";

    const storeSetting = await prisma.storeSetting.upsert({
      where: { shop: session.shop },
      update: { plan: currentPlan },
      create: { shop: session.shop, plan: currentPlan, clickCount: 0, monthStart: new Date() },
    });

    planInfo = { plan: storeSetting.plan, clickCount: storeSetting.clickCount };
  } catch (planError) {
    console.error("Error checking plan status:", planError);
  }

  // Fetch widget settings
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
    const settings = rawMetafield ? { ...DEFAULT_SETTINGS, ...JSON.parse(rawMetafield) } : DEFAULT_SETTINGS;

    return json(
      {
        settings,
        plan: planInfo.plan,
        clickCount: planInfo.clickCount,
      },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
    );
  } catch (error) {
    return json({
      settings: DEFAULT_SETTINGS,
      plan: planInfo.plan,
      clickCount: planInfo.clickCount,
    });
  }
};

// ============================================================
// ACTION
// ============================================================

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsPayload = {
    phoneNumber: formData.get("phoneNumber") || DEFAULT_SETTINGS.phoneNumber,
    defaultMessage: formData.get("defaultMessage") || DEFAULT_SETTINGS.defaultMessage,
    widgetColor: formData.get("widgetColor") || DEFAULT_SETTINGS.widgetColor,
    selectedIcon: formData.get("selectedIcon") || DEFAULT_SETTINGS.selectedIcon,
    customIconUrl: formData.get("customIconUrl") || "",
    position: formData.get("position") || DEFAULT_SETTINGS.position,
    widgetSizePx: Number(formData.get("widgetSizePx")) || DEFAULT_SETTINGS.widgetSizePx,
    mobilePosition: formData.get("mobilePosition") || DEFAULT_SETTINGS.mobilePosition,
    mobileWidgetSizePx: Number(formData.get("mobileWidgetSizePx")) || DEFAULT_SETTINGS.mobileWidgetSizePx,
    greetingHeader: formData.get("greetingHeader") || DEFAULT_SETTINGS.greetingHeader,
    greetingSubtext: formData.get("greetingSubtext") || DEFAULT_SETTINGS.greetingSubtext,
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

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Index() {
  const { settings: loadedSettings, plan, clickCount } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();

  // State for form fields
  const [phoneNumber, setPhoneNumber] = useState(loadedSettings.phoneNumber);
  const [defaultMessage, setDefaultMessage] = useState(loadedSettings.defaultMessage);
  const [widgetColor, setWidgetColor] = useState(loadedSettings.widgetColor);
  const [selectedIcon, setSelectedIcon] = useState(loadedSettings.selectedIcon || "whatsapp-classic");
  const [customIconUrl, setCustomIconUrl] = useState(loadedSettings.customIconUrl || "");
  const [position, setPosition] = useState(loadedSettings.position);
  const [widgetSizePx, setWidgetSizePx] = useState(Number(loadedSettings.widgetSizePx) || 56);
  const [mobilePosition, setMobilePosition] = useState(loadedSettings.mobilePosition || loadedSettings.position);
  const [mobileWidgetSizePx, setMobileWidgetSizePx] = useState(Number(loadedSettings.mobileWidgetSizePx) || 48);
  const [greetingHeader, setGreetingHeader] = useState(loadedSettings.greetingHeader);
  const [greetingSubtext, setGreetingSubtext] = useState(loadedSettings.greetingSubtext);

  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isSaving = navigation.state === "submitting";

  // Handle success message
  useEffect(() => {
    if (actionData?.status === "success" && actionData?.settings) {
      setPhoneNumber(actionData.settings.phoneNumber);
      setDefaultMessage(actionData.settings.defaultMessage);
      setWidgetColor(actionData.settings.widgetColor);
      setSelectedIcon(actionData.settings.selectedIcon);
      setCustomIconUrl(actionData.settings.customIconUrl || "");
      setPosition(actionData.settings.position);
      setWidgetSizePx(Number(actionData.settings.widgetSizePx) || 56);
      setMobilePosition(actionData.settings.mobilePosition || "bottom-right");
      setMobileWidgetSizePx(Number(actionData.settings.mobileWidgetSizePx) || 48);
      setGreetingHeader(actionData.settings.greetingHeader);
      setGreetingSubtext(actionData.settings.greetingSubtext);

      setSavedSuccess(true);
      const timer = setTimeout(() => setSavedSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  // Save handler
  const handleSave = () => {
    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber);
    formData.append("defaultMessage", defaultMessage);
    formData.append("widgetColor", widgetColor);
    formData.append("selectedIcon", selectedIcon);
    formData.append("customIconUrl", customIconUrl);
    formData.append("position", position);
    formData.append("widgetSizePx", widgetSizePx.toString());
    formData.append("mobilePosition", mobilePosition);
    formData.append("mobileWidgetSizePx", mobileWidgetSizePx.toString());
    formData.append("greetingHeader", greetingHeader);
    formData.append("greetingSubtext", greetingSubtext);

    submit(formData, { method: "post" });
  };

  // Preview calculations
  const activeIconObj = UNIQUE_ICONS.find((item) => item.id === selectedIcon) || UNIQUE_ICONS[0];
  const activeSizePx = previewDevice === "mobile" ? mobileWidgetSizePx : widgetSizePx;
  const activePos = previewDevice === "mobile" ? mobilePosition : position;

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
        {/* Plan Status Banner */}
        {plan === "pro-plan" ? (
          <Banner title="Pro Plan Active" tone="success">
            <p>You have unlimited WhatsApp clicks.</p>
          </Banner>
        ) : (
          <Banner
            title={`Free Plan — ${clickCount}/100 clicks used`}
            tone={clickCount >= 100 ? "critical" : "info"}
          >
            <BlockStack gap="200">
              <p>Upgrade to Pro Plan for unlimited WhatsApp clicks.</p>
              <Button
                primary
                onClick={() => {
                  window.open('https://apps.shopify.com/fs-whatsapp/pricing', '_blank');
                }}
              >
                Upgrade to Pro Plan ($4.99/mo)
              </Button>
            </BlockStack>
          </Banner>
        )}

        {/* Success/Error Messages */}
        {savedSuccess && <Banner title="Settings saved successfully!" tone="success" />}
        {actionData?.status === "error" && <Banner title={actionData.message} tone="critical" />}

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Merchant Setup Card */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Merchant Setup
                  </Text>
                  <TextField
                    label="WhatsApp Phone Number"
                    placeholder="923424593231"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    helpText="Include country code without '+' sign (e.g. 923424593231)"
                    autoComplete="off"
                  />
                  <TextField
                    label="Default Message Prefix"
                    placeholder="Hello! I have a question about your store."
                    value={defaultMessage}
                    onChange={setDefaultMessage}
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              {/* Widget Style & Sizing Card */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Widget Style & Sizing
                  </Text>

                  <Text as="p" variant="bodySm" fontWeight="medium">
                    Select Icon Style:
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
                            {icon.render(widgetColor, 40, customIconUrl)}
                          </div>
                          <Text variant="bodyXs" as="span" alignment="center">
                            {icon.name}
                          </Text>
                        </div>
                      </Grid.Cell>
                    ))}
                  </Grid>

                  {selectedIcon === "custom-upload" && (
                    <Box
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <TextField
                        label="Custom Icon Image URL (.png, .jpg, .svg)"
                        placeholder="https://cdn.shopify.com/s/files/1/.../my-icon.png"
                        value={customIconUrl}
                        onChange={setCustomIconUrl}
                        helpText="Upload image in Shopify Admin > Content > Files and paste the URL here."
                        autoComplete="off"
                      />
                    </Box>
                  )}

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

                  <Divider />

                  {/* Desktop Settings */}
                  <Text as="h3" variant="headingSm" tone="subdued">
                    💻 Desktop Settings
                  </Text>
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <RangeSlider
                        label={`Desktop Widget Size: ${widgetSizePx}px`}
                        value={widgetSizePx}
                        onChange={(val) => setWidgetSizePx(Number(val))}
                        min={30}
                        max={100}
                        step={1}
                        output
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <Select
                        label="Desktop Position"
                        options={[
                          { label: "Bottom Right", value: "bottom-right" },
                          { label: "Bottom Left", value: "bottom-left" },
                        ]}
                        value={position}
                        onChange={setPosition}
                      />
                    </Grid.Cell>
                  </Grid>

                  <Divider />

                  {/* Mobile Settings */}
                  <Text as="h3" variant="headingSm" tone="subdued">
                    📱 Mobile Settings
                  </Text>
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <RangeSlider
                        label={`Mobile Widget Size: ${mobileWidgetSizePx}px`}
                        value={mobileWidgetSizePx}
                        onChange={(val) => setMobileWidgetSizePx(Number(val))}
                        min={30}
                        max={90}
                        step={1}
                        output
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <Select
                        label="Mobile Position"
                        options={[
                          { label: "Bottom Right", value: "bottom-right" },
                          { label: "Bottom Left", value: "bottom-left" },
                        ]}
                        value={mobilePosition}
                        onChange={setMobilePosition}
                      />
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Popup Header Customization Card */}
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

          {/* Live Preview */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Live Preview
                  </Text>
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
                  <div
                    style={{
                      width: previewDevice === "mobile" ? "240px" : "100%",
                      height: previewDevice === "mobile" ? "390px" : "100%",
                      backgroundColor: "#ffffff",
                      borderRadius: previewDevice === "mobile" ? "24px" : "8px",
                      border: previewDevice === "mobile" ? "8px solid #1a1a1a" : "1px solid #dfe3e8",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "12px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        height: "12px",
                        backgroundColor: "#f0f2f5",
                        borderRadius: "4px",
                        width: "40%",
                      }}
                    />

                    {/* Chat Popup Preview */}
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        border: "1px solid #e1e3e5",
                        overflow: "hidden",
                        width: previewDevice === "mobile" ? "100%" : "260px",
                        alignSelf: activePos === "bottom-left" ? "flex-start" : "flex-end",
                        marginBottom: `${Math.max(10, activeSizePx * 0.7)}px`,
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

                    {/* Floating Button Preview */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: activePos === "bottom-left" ? "10px" : "auto",
                        right: activePos === "bottom-right" ? "10px" : "auto",
                        width: `${activeSizePx}px`,
                        height: `${activeSizePx}px`,
                        borderRadius: "50%",
                        backgroundColor: widgetColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        transition: "width 0.1s ease, height 0.1s ease",
                      }}
                    >
                      {activeIconObj.render(widgetColor, activeSizePx, customIconUrl)}
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