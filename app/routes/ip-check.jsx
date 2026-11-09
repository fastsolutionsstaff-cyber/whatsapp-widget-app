
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
    const response = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    const data = await response.json();

    if (!response.ok || !data.ip) {
      return json({ error: "IP lookup failed", details: data }, 502);
    }

    return json({
      ip: data.ip,
      asn: data.asn,
      organization: data.org,
      country: data.country_name,
      countryCode: data.country,
      city: data.city,
    });
  } catch (error) {
    return json({
      error: error.message || "IP lookup failed",
    }, 502);
  }
}
