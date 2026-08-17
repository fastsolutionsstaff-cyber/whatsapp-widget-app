import React from 'react';
import { Page, Layout, Card, BlockStack, Text, Divider } from "@shopify/polaris";

export default function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <div>
                <Text variant="headingXl" as="h1">Widget-WhatsApp Privacy Policy</Text>
                <Text variant="bodySm" tone="subdued">Last updated: August 17, 2026</Text>
              </div>

              <Divider />

              <BlockStack gap="300">
                <Text variant="bodyMd" as="p">
                  Widget-WhatsApp ("we", "our", or "us") operates the Widget-WhatsApp Shopify application (the "Service"). 
                  This page informs merchants and store visitors of our policies regarding the collection, use, and 
                  disclosure of personal data when using our Service.
                </Text>
              </BlockStack>

              {/* ===== GDPR & CCPA COMPLIANCE ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">1. GDPR & CCPA Compliance</Text>
                <Text variant="bodyMd" as="p">
                  We are committed to complying with the General Data Protection Regulation (GDPR) and the 
                  California Consumer Privacy Act (CCPA). We collect and process data only with explicit consent 
                  from merchants and their customers. Users have the right to access, correct, or request deletion 
                  of their data at any time.
                </Text>
              </BlockStack>

              {/* ===== DATA WE COLLECT ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">2. Data We Collect</Text>
                <Text variant="bodyMd" as="p">
                  To provide a seamless WhatsApp live chat experience across your store, our application integrates 
                  directly into your <strong>storefront, product pages, and cart pages</strong>. The data we process includes:
                </Text>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><Text variant="bodyMd" as="span">Store name and Shopify store URL</Text></li>
                  <li><Text variant="bodyMd" as="span">WhatsApp phone number configured by the merchant</Text></li>
                  <li><Text variant="bodyMd" as="span">Widget settings (color, icon, position, size)</Text></li>
                  <li><Text variant="bodyMd" as="span">Widget click analytics (click count only, no customer data)</Text></li>
                </ul>
              </BlockStack>

              {/* ===== DATA WE DO NOT COLLECT ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">3. Data We Do Not Collect</Text>
                <Text variant="bodyMd" as="p">
                  We do not store, log, or process any sensitive personal customer data on our servers:
                </Text>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><Text variant="bodyMd" as="span">Customer names, emails, or phone numbers</Text></li>
                  <li><Text variant="bodyMd" as="span">Customer chat messages (all chats go directly through WhatsApp)</Text></li>
                  <li><Text variant="bodyMd" as="span">Payment or financial information</Text></li>
                </ul>
              </BlockStack>

              {/* ===== DATA RETENTION ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">4. Data Retention</Text>
                <Text variant="bodyMd" as="p">
                  We retain store configuration data for as long as the merchant has the app installed. 
                  When a merchant uninstalls the app:
                </Text>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><Text variant="bodyMd" as="span">All store configuration data is permanently deleted within 30 days</Text></li>
                  <li><Text variant="bodyMd" as="span">Click analytics data is anonymized and aggregated</Text></li>
                  <li><Text variant="bodyMd" as="span">Merchants can request immediate data deletion at any time</Text></li>
                </ul>
              </BlockStack>

              {/* ===== HOW WE USE DATA ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">5. How We Use Your Data</Text>
                <Text variant="bodyMd" as="p">
                  The data we collect is used solely to:
                </Text>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><Text variant="bodyMd" as="span">Display and customize the WhatsApp widget on your storefront</Text></li>
                  <li><Text variant="bodyMd" as="span">Track widget usage to manage free tier limits (100 clicks/month)</Text></li>
                  <li><Text variant="bodyMd" as="span">Process subscription payments for Pro Plan merchants</Text></li>
                </ul>
              </BlockStack>

              {/* ===== DATA SECURITY ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">6. Data Security</Text>
                <Text variant="bodyMd" as="p">
                  We prioritize the security of your store data. Standard technical safeguards are implemented to 
                  protect the integrity of our application, ensuring a safe and reliable integration with your 
                  Shopify admin and storefront. All data is encrypted in transit and at rest.
                </Text>
              </BlockStack>

              {/* ===== DATA SHARING ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">7. Data Sharing</Text>
                <Text variant="bodyMd" as="p">
                  We do not sell, trade, or share your personal data with third parties except:
                </Text>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><Text variant="bodyMd" as="span">Shopify (for app installation and billing)</Text></li>
                  <li><Text variant="bodyMd" as="span">WhatsApp (for chat functionality, governed by WhatsApp's Privacy Policy)</Text></li>
                  <li><Text variant="bodyMd" as="span">Payment processors (Stripe/Shopify Payments for subscription billing)</Text></li>
                </ul>
              </BlockStack>

              {/* ===== YOUR RIGHTS ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">8. Your Rights</Text>
                <Text variant="bodyMd" as="p">
                  You have the following rights regarding your data:
                </Text>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><Text variant="bodyMd" as="span"><strong>Right to Access:</strong> Request a copy of your data</Text></li>
                  <li><Text variant="bodyMd" as="span"><strong>Right to Rectification:</strong> Correct inaccurate data</Text></li>
                  <li><Text variant="bodyMd" as="span"><strong>Right to Erasure:</strong> Request deletion of your data</Text></li>
                  <li><Text variant="bodyMd" as="span"><strong>Right to Data Portability:</strong> Receive your data in a portable format</Text></li>
                  <li><Text variant="bodyMd" as="span"><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</Text></li>
                </ul>
              </BlockStack>

              {/* ===== COOKIES ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">9. Cookies</Text>
                <Text variant="bodyMd" as="p">
                  Our app uses essential cookies to maintain user sessions and preferences. These cookies are 
                  strictly necessary for the proper functioning of the app and do not track users across other websites.
                </Text>
              </BlockStack>

              {/* ===== CHANGES TO POLICY ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">10. Changes to This Privacy Policy</Text>
                <Text variant="bodyMd" as="p">
                  We may update our Privacy Policy periodically to reflect enhancements in our app features or 
                  compliance updates. Any modifications will be posted directly on this page. We encourage 
                  merchants to review this policy regularly.
                </Text>
              </BlockStack>

              {/* ===== CONTACT ===== */}
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">11. Contact Us</Text>
                <Text variant="bodyMd" as="p">
                  If you have any questions, feedback, or concerns regarding this Privacy Policy or our 
                  WhatsApp integration app, please contact us:
                </Text>
                <BlockStack gap="100">
                  <Text variant="bodyMd" as="p"><strong>Email:</strong> support@yourdomain.com</Text>
                  <Text variant="bodyMd" as="p"><strong>Website:</strong> https://whatsapp-widget-app.vercel.app</Text>
                  <Text variant="bodyMd" as="p"><strong>Data Protection Officer:</strong> dpo@yourdomain.com</Text>
                </BlockStack>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}