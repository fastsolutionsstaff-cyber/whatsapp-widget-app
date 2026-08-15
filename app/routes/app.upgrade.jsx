import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  try {
    // Billing check aur request
    await billing.require({
      plans: ["pro-plan"],
      onFailure: async () => {
        const url = new URL(request.url);
        const returnUrl = `https://${url.host}/app`;
        
        throw billing.request({ 
          plan: "pro-plan",
          isTest: true, 
          returnUrl: returnUrl,
        });
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    throw error;
  }

  // Agar plan active hai toh seedha app dashboard par bhej dein
  return redirect("/app");
}