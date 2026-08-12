import { json } from "@remix-run/node";
import prisma from "../db.server";

const FREE_CLICK_LIMIT = 1;

export async function action({ request }) {
  if (request.method !== "POST") {
    return json(
      {
        success: false,
        error: "Method not allowed",
      },
      { status: 405 }
    );
  }

  try {
    const url = new URL(request.url);

    let shop = url.searchParams.get("shop");

    if (!shop) {
      try {
        const body = await request.json();
        shop = body?.shop;
      } catch {
        // No JSON body
      }
    }

    if (!shop) {
      return json(
        {
          success: false,
          error: "Shop parameter missing",
        },
        { status: 400 }
      );
    }

    let storeSetting = await prisma.storeSetting.findUnique({
      where: {
        shop,
      },
    });

    if (!storeSetting) {
      storeSetting = await prisma.storeSetting.create({
        data: {
          shop,
          clickCount: 0,
          plan: "starter-plan",
        },
      });
    }

    /*
     * PRO PLAN
     * Unlimited clicks.
     */
    if (storeSetting.plan === "pro-plan") {
      return json({
        success: true,
        limitReached: false,
        clickCount: storeSetting.clickCount,
        plan: "pro-plan",
      });
    }

    /*
     * STARTER PLAN
     * Testing limit = 1 click.
     */
    if (
      storeSetting.plan === "starter-plan" &&
      storeSetting.clickCount >= FREE_CLICK_LIMIT
    ) {
      return json({
        success: true,
        limitReached: true,
        clickCount: storeSetting.clickCount,
        plan: "starter-plan",
        message:
          "Your free WhatsApp click limit has been reached. Please upgrade to Pro Plan.",
      });
    }

    /*
     * Count the allowed click.
     */
    const updatedSetting = await prisma.storeSetting.update({
      where: {
        shop,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return json({
      success: true,
      limitReached: false,
      clickCount: updatedSetting.clickCount,
      plan: updatedSetting.plan,
    });
  } catch (error) {
    console.error("Error tracking WhatsApp click:", error);

    /*
     * IMPORTANT:
     * If tracking fails, DO NOT allow WhatsApp to open.
     */
    return json(
      {
        success: false,
        limitReached: false,
        error: "Unable to verify WhatsApp click limit.",
      },
      { status: 500 }
    );
  }
}