export async function loader() {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return Response.json(
        { error: data.reason || "IP lookup failed" },
        { status: 502 }
      );
    }

    return Response.json(
      {
        ip: data.ip,
        asn: data.asn,
        organization: data.org,
        country: data.country,
        country_name: data.country_name,
        region: data.region,
        city: data.city,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Request failed" },
      { status: 502 }
    );
  }
}