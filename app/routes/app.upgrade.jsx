import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  // Billing check aur request
  await billing.require({
    plans: ["pro-plan"],
    onFailure: async () => billing.request({ 
      plan: "pro-plan",
      isTest: true, 
      // Return URL ko apne app ke dashboard route par set karein
      returnUrl: "https://admin.shopify.com/store/your-store-handle/apps/your-app-handle" 
    }),
  });

  // Agar plan active hai toh seedha app dashboard par bhej dein
  return redirect("/app");
}