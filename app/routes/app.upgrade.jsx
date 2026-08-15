import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  // Check karega ke pro-plan active hai ya nahi, nahi toh payment page khol dega
  await billing.require({
    plans: ["pro-plan"],
    onFailure: async () => billing.request({ 
      plan: "pro-plan",
      isTest: true, // Development store ke liye test mode (Live karne par ise false ya hata sakte hain)
      returnUrl: "https://admin.shopify.com/store/current/apps/" // Ya apna direct return URL
    }),
  });

  return null;
}