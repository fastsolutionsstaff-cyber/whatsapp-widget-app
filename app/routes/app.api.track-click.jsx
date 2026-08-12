import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const url = new URL(request.url);
    let shop = url.searchParams.get("shop");

    if (!shop) {
      try {
        const body = await request.json();
        shop = body.shop;
      } catch (e) {}
    }

    if (!shop) {
      return json({ error: "Shop parameter missing" }, { status: 400 });
    }

    // 1. Store settings find karein ya create karein
    let storeSetting = await prisma.storeSetting.findUnique({
      where: { shop },
    });

    if (!storeSetting) {
      storeSetting = await prisma.storeSetting.create({
        data: { shop, clickCount: 0, plan: "starter-plan" },
      });
    }

    // 2. Testing ke liye limit 1 kar di hai (Pehle click par hi paywall aa jayega)
    if (storeSetting.plan === "starter-plan" && storeSetting.clickCount >= 1) {
      return json({ 
        success: false, 
        limitReached: true, 
        message: "Click limit reached. Please upgrade to Pro Plan." 
      });
    }

    // 3. Click count barha dein
    const updatedSetting = await prisma.storeSetting.update({
      where: { shop },
      data: { clickCount: { increment: 1 } },
    });

    return json({ 
      success: true, 
      limitReached: false,
      clickCount: updatedSetting.clickCount,
      plan: updatedSetting.plan 
    });

  } catch (error) {
    console.error("Error tracking click:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
}