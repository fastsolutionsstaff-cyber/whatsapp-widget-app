import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

const FREE_CLICK_LIMIT = 100;

async function getShopifyPlan(admin) {
  try {
    const response = await admin.graphql(`
      #graphql
      query GetActiveSubscription {
        currentAppInstallation {
          activeSubscriptions {
            name
            status
          }
        }
      }
    `);

    const data = await response.json();

    const subscriptions =
      data.data?.currentAppInstallation?.activeSubscriptions ||
      [];

    const activeSubscriptions = subscriptions.filter(
      (subscription) =>
        subscription.status === "ACTIVE"
    );

    /*
     * Your paid plan is named Pro.
     */
    const hasPro = activeSubscriptions.some(
      (subscription) =>
        subscription.name &&
        subscription.name.toLowerCase().includes("pro")
    );

    return hasPro
      ? "pro-plan"
      : "starter-plan";
  } catch (error) {
    console.error(
      "Shopify subscription check failed:",
      error
    );

    /*
     * If Shopify cannot be checked, do NOT
     * automatically give unlimited access.
     */
    return null;
  }
}

export async function loader({ request }) {
  return handleTracking(request);
}

export async function action({ request }) {
  return handleTracking(request);
}

async function handleTracking(request) {
  try {
    let shop = null;
    let admin = null;

    /*
     * Authenticate through Shopify App Proxy.
     */
    try {
      const proxyContext =
        await authenticate.public.appProxy(request);

      if (
        proxyContext?.session?.shop
      ) {
        shop = proxyContext.session.shop;
      }

      admin = proxyContext?.admin || null;
    } catch (error) {
      console.error(
        "App Proxy authentication error:",
        error
      );
    }

    /*
     * Fallback for testing.
     */
    if (!shop) {
      const url = new URL(request.url);

      shop = url.searchParams.get("shop");
    }

    if (!shop) {
      return json(
        {
          success: false,
          error: "Unauthorized or Missing shop",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Get/create local store record.
     */
    let storeSetting =
      await prisma.storeSetting.findUnique({
        where: { shop },
      });

    if (!storeSetting) {
      storeSetting =
        await prisma.storeSetting.create({
          data: {
            shop,
            clickCount: 0,
            plan: "starter-plan",
            monthStart: new Date(),
          },
        });
    }

    /*
     * Reset the click counter when a new month starts.
     */
    const now = new Date();

    const monthStart =
      new Date(storeSetting.monthStart);

    const monthHasPassed =
      now.getFullYear() !==
        monthStart.getFullYear() ||
      now.getMonth() !==
        monthStart.getMonth();

    if (monthHasPassed) {
      storeSetting =
        await prisma.storeSetting.update({
          where: { shop },
          data: {
            clickCount: 0,
            monthStart: now,
          },
        });
    }

    /*
     * IMPORTANT:
     * Ask Shopify whether the merchant is
     * actually subscribed to Pro.
     */
    let shopifyPlan = null;

    if (admin) {
      shopifyPlan =
        await getShopifyPlan(admin);
    }

    /*
     * If Shopify confirms Pro, update our DB.
     */
    if (shopifyPlan === "pro-plan") {
      storeSetting =
        await prisma.storeSetting.update({
          where: { shop },
          data: {
            plan: "pro-plan",
          },
        });

      /*
       * Pro = unlimited clicks.
       */
      const updated =
        await prisma.storeSetting.update({
          where: { shop },
          data: {
            clickCount: {
              increment: 1,
            },
          },
        });

      return json({
        success: true,
        limitReached: false,
        clickCount: updated.clickCount,
        plan: "pro-plan",
      });
    }

    /*
     * If Shopify says there is no Pro subscription,
     * make sure the database is Starter.
     */
    if (shopifyPlan === "starter-plan") {
      /*
       * If the merchant was previously Pro and
       * is no longer Pro, reset the free counter
       * so Starter gets a fresh 100-click allowance.
       */
      if (storeSetting.plan === "pro-plan") {
        storeSetting =
          await prisma.storeSetting.update({
            where: { shop },
            data: {
              plan: "starter-plan",
              clickCount: 0,
              monthStart: now,
            },
          });
      } else if (
        storeSetting.plan !== "starter-plan"
      ) {
        storeSetting =
          await prisma.storeSetting.update({
            where: { shop },
            data: {
              plan: "starter-plan",
            },
          });
      }
    }

    /*
     * STARTER PLAN
     *
     * 100 clicks are allowed.
     */
    if (
      storeSetting.clickCount >=
      FREE_CLICK_LIMIT
    ) {
      return json({
        success: true,
        limitReached: true,
        clickCount: storeSetting.clickCount,
        plan: "starter-plan",
        message:
          "Your 100 free WhatsApp clicks have been used. Please upgrade to Pro Plan.",
      });
    }

    /*
     * Count the successful Starter click.
     */
    const updated =
      await prisma.storeSetting.update({
        where: { shop },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });

    return json({
      success: true,
      limitReached: false,
      clickCount: updated.clickCount,
      plan: "starter-plan",
    });
  } catch (error) {
    console.error(
      "Error tracking WhatsApp click:",
      error
    );

    return json(
      {
        success: false,
        limitReached: false,
        error:
          "Unable to verify WhatsApp click limit.",
      },
      {
        status: 500,
      }
    );
  }
}