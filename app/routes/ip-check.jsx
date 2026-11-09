
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function loader() {
  try {
    const response = await fetch(
      "https://api.ipify.org?format=json",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      return json({
        error: `IP service error: ${response.status}`,
      }, 502);
    }

    const data = await response.json();

    if (!data.ip) {
      return json({ error: "Public IP not found" }, 502);
    }

    return json({
      outboundIP: data.ip,
      source: "Vercel server function",
      region: "iad1",
    });
  } catch (error) {
    return json({
      error: error.message || "IP check failed",
    }, 502);
  }
}
