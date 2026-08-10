// app/routes/$.tsx
import { json } from "@remix-run/node";

export async function loader() {
  return json({ message: "Page not found" }, { status: 404 });
}

export default function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="/app">Go back to Dashboard</a>
    </div>
  );
}