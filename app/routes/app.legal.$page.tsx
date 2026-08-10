// app/routes/app.legal.$page.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export async function loader({ params }: LoaderFunctionArgs) {
  const page = params.page || "support";
  return json({ page });
}

export default function LegalPage() {
  const { page } = useLoaderData<typeof loader>();

  const contentMap: Record<string, { title: string; body: string }> = {
    "privacy-policy": {
      title: "Privacy Policy",
      body: `Last updated: August 10, 2026

      At Widget WhatsApp, accessible from our Shopify app dashboard, we respect your privacy and are committed to protecting your personal data. This Privacy Policy document outlines the types of information collected and recorded by Widget WhatsApp and how we utilize it.

      1. Information Collection: When you install our application, we automatically access store-specific details including your shop domain, primary contact email, and widget configuration preferences required to render the floating chat widget correctly on your storefront.

      2. Data Usage & Security: All data collected is strictly utilized to operate, maintain, and enhance the performance of the widget. We implement robust, industry-standard SSL encryption and secure cloud protocols to prevent unauthorized access or disclosure.

      3. Third-Party Integrations: Our application operates via Shopify's official infrastructure and secure hosting providers (such as Vercel). We do not sell, trade, or transfer your data to outside parties.

      4. Policy Updates: We reserve the right to modify this privacy policy at any time. Changes will take effect immediately upon posting to the application interface.`
    },
    "terms-of-service": {
      title: "Terms of Service",
      body: `Welcome to Widget WhatsApp! These terms and conditions govern your use of our application provided via the Shopify App Store.

      By installing or using our application, you agree to be bound by these terms. If you disagree with any part of these terms, you must uninstall the application immediately.

      1. License to Use: We grant you a limited, non-exclusive, non-transferable license to utilize the Widget WhatsApp application on your active Shopify store in accordance with these terms.

      2. Restrictions: You agree not to reverse engineer, decompile, modify, or attempt to extract the source code of the application, nor use it for any unlawful or malicious activities.

      3. Service Availability: The application is provided on an "as-is" and "as-available" basis. While we maintain high uptime standards, we do not guarantee uninterrupted or error-free service.

      4. Limitation of Liability: Widget WhatsApp shall not be held liable for any indirect, incidental, or consequential damages arising out of your use or inability to use the application.`
    },
    "refund-policy": {
      title: "Refund Policy",
      body: `Thank you for using Widget WhatsApp. We value your business and aim to provide a seamless customer support experience.

      1. Subscription Billing: Our app operates on a recurring subscription model billed securely through the official Shopify billing engine. 

      2. Refund Eligibility: Because we offer a risk-free evaluation period to test all features prior to committing, subscription fees are generally non-refundable. Refunds for partial months or unused periods are not issued unless mandated by exceptional technical failures directly caused by our application servers.

      3. Cancellation Policy: You retain the right to cancel your subscription at any time simply by uninstalling the application from your Shopify admin dashboard. Billing terminates immediately upon removal.`
    },
    "support": {
      title: "Merchant Support & Contact",
      body: `Need assistance with widget placement, custom styling, or configuration? Our dedicated technical team is ready to help you succeed.

      - Official Support Email: fastsolutionsstaff@gmail.com
      - Response Window: We typically review and respond to all merchant inquiries within 24 business hours.
      - Documentation: Ensure your app config and Vercel deployment pipelines are fully synchronized for optimal storefront performance.`
    }
  };

  const currentContent = contentMap[page] || contentMap["support"];

  return (
    <Page title={currentContent.title} backAction={{ content: "Dashboard", url: "/app" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">{currentContent.title}</Text>
              <div style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#202223", fontSize: "14px" }}>
                {currentContent.body}
              </div>
              <div style={{ marginTop: "24px", borderTop: "1px solid #e1e3e5", paddingTop: "16px" }}>
                <Text variant="bodySm" as="p">
                  Looking to modify your widget settings? Return to your <Link to="/app">Main Dashboard</Link>.
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}