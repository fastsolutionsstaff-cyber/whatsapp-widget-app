import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

const FREE_CLICK_LIMIT = 100;

export async function loader({ request }) {
  return handleTracking(request);
}

export async function action({ request }) {
  return handleTracking(request);
}

async function handleTracking(request) {
  try {
    const { session } = await authenticate.public.appProxy(request);
    if (!session) {
      return json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const shop = session.shop;

    let storeSetting = await prisma.storeSetting.findUnique({ where: { shop } });

    // Agar record nahi hai, toh 0 se create karo
    if (!storeSetting) {
      storeSetting = await prisma.storeSetting.create({
        data: { shop, clickCount: 0, plan: "starter-plan", monthStart: new Date() },
      });
    }

    // Mahina check karne ka logic
    const now = new Date();
    const monthStart = new Date(storeSetting.monthStart);
    const monthHasPassed =
      now.getFullYear() !== monthStart.getFullYear() ||
      now.getMonth() !== monthStart.getMonth();

    if (monthHasPassed) {
      storeSetting = await prisma.storeSetting.update({
        where: { shop },
        data: { clickCount: 0, monthStart: now },
      });
    }

    // Agar Pro plan hai, toh seedha increment karo
    if (storeSetting.plan === "pro-plan") {
      const updated = await prisma.storeSetting.update({
        where: { shop },
        data: { clickCount: { increment: 1 } },
      });
      return json({ success: true, limitReached: false, clickCount: updated.clickCount, plan: "pro-plan" });
    }

    // Agar Starter plan hai aur limit cross ho chuki hai
    if (storeSetting.plan === "starter-plan" && storeSetting.clickCount >= FREE_CLICK_LIMIT) {
      return json({
        success: true,
        limitReached: true,
        clickCount: storeSetting.clickCount,
        plan: "starter-plan",
        message: "Your 100 free WhatsApp clicks have been used. Please upgrade to Pro Plan.",
      });
    }

    // Normal increment for Starter plan under limit
    const updated = await prisma.storeSetting.update({
      where: { shop },
      data: { clickCount: { increment: 1 } },
    });

    return json({ success: true, limitReached: false, clickCount: updated.clickCount, plan: updated.plan });
    
  } catch (error) {
    console.error("Error tracking WhatsApp click:", error);
    return json({ success: false, limitReached: false, error: "Unable to verify WhatsApp click limit." }, { status: 500 });
  }
}