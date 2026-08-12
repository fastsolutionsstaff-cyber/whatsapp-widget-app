import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function action({ request }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { shop } = body;

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

    // 2. Starter plan ke liye 100 clicks ki limit check karein
    if (storeSetting.plan === "starter-plan" && storeSetting.clickCount >= 100) {
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
      success: false, // (Agar aap chahte hain ke pehle WhatsApp khule, to isko apne frontend ke hisab se set rakhein)
      clickCount: updatedSetting.clickCount,
      plan: updatedSetting.plan 
    });

  } catch (error) {
    console.error("Error tracking click:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
}