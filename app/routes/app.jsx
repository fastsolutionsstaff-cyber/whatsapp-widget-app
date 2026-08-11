import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
  };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app/dashboard" rel="home">
          Dashboard
        </Link>
        <Link to="/app">
          Customize Widget
        </Link>
        <Link to="/app/product-widget">
          Product Widget Guide
        </Link>
        <Link to="/app/setup">
          Setup Guide
        </Link>
        <Link to="/app/analytics">
          Analytics
        </Link>
        <Link to="/app/help">
          Help & Support
        </Link>
        <Link to="/app/about">
          About
        </Link>
        <Link to="/app/additional">
          Additional
        </Link>
      </NavMenu>

      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};