import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  return handleProxyUpgrade(request);
}

export async function action({ request }) {
  return handleProxyUpgrade(request);
}

async function handleProxyUpgrade(request) {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);

    if (!admin || !session) {
      return new Response("Shopify store authentication is required.", {
        status: 401,
      });
    }

    const response = await admin.graphql(`
      #graphql
      query GetAppHandle {
        currentAppInstallation {
          app {
            handle
          }
        }
      }
    `);

    const data = await response.json();
    const appHandle =
      data.data?.currentAppInstallation?.app?.handle ||
      process.env.SHOPIFY_APP_HANDLE ||
      "fs-whatsapp";

    const storeHandle = session.shop.replace(".myshopify.com", "");
    const embeddedUpgradeUrl = `https://admin.shopify.com/store/${storeHandle}/apps/${appHandle}/app/upgrade`;

    // Return HTML with script to redirect top window
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to Upgrade...</title>
        </head>
        <body>
          <script>
            window.top.location.href = "${embeddedUpgradeUrl}";
          </script>
          <p>Redirecting to upgrade page...</p>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("App Proxy Upgrade Error:", error);
    return new Response("Unable to open the upgrade page.", {
      status: 500,
    });
  }
}