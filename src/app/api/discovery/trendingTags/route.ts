import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

// Caching Mechanism
interface CachedData {
  data: any;
}

const cache = new LRUCache<string, CachedData>({
  max: 100, // maximum items in the cache
  ttl: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
});

export async function GET(req: NextRequest, res: NextResponse) {
  const cachedData = cache.get("data");

  if (cachedData) {
    return new NextResponse(JSON.stringify(cachedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    // Fetch data from the external API
    const apiUrl = "https://api.cloutapis.com/clouttags/trending?numToFetch=5";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${apiUrl}`);
    }

    const data = await response.json();

    // Update cache
    cache.set("data", data);

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
