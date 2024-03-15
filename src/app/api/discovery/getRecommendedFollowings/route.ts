import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { LRUCache } from "lru-cache";

// Caching Mechanism
interface CachedData {
  data: Top3Result[];
}

const cache = new LRUCache<string, CachedData>({
  max: 100, // maximum items in the cache
  ttl: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
});

interface ProfileEntry {
  IsHidden: boolean;
  PublicKeyBase58Check: string;
  Description: string;
  Username: string;
  CoinPriceBitCloutNanos: number;
  CoinEntry: any; // Replace with the actual type
}

interface DataEntry {
  NumNFTCopies: number;
  NFTRoyaltyToCreatorBasisPoints: number;
  RecloutCount: number;
  ImageURLs: any; // Replace with the actual type
  ProfileEntryResponse: ProfileEntry;
  query: {
    text: string;
    bio_search: any; // Replace with the actual type
    search_type: string;
  };
}

interface Data {
  page: number;
  size: number;
  total_count: number;
  data: DataEntry[];
}

interface Top3Result {
  PublicKeyBase58Check: string;
  Username: string;
}

function findTopNPublicKeys(
  data: Data,
  userId: string,
  n: number
): Top3Result[] {
  // Extracting the array of data
  const dataArray = data.data;

  // Count occurrences of each PublicKeyBase58Check
  const publicKeyCounts: Record<string, number> = {};
  dataArray.forEach((entry) => {
    const publicKey = entry.ProfileEntryResponse.PublicKeyBase58Check;
    publicKeyCounts[publicKey] = (publicKeyCounts[publicKey] || 0) + 1;
  });

  // Sort the public keys by their counts in descending order
  const sortedPublicKeys = Object.keys(publicKeyCounts).sort(
    (a, b) => publicKeyCounts[b] - publicKeyCounts[a]
  );

  // Extract the top N public keys, excluding the user's content
  const topNPublicKeys = sortedPublicKeys
    .filter((publicKey) => publicKey !== userId)
    .slice(0, n);

  // Create an array with PublicKeyBase58Check and Username for the top N
  const topNData: Top3Result[] = topNPublicKeys.map((publicKey) => {
    const entry = dataArray.find(
      (item) => item.ProfileEntryResponse.PublicKeyBase58Check === publicKey
    );
    return {
      PublicKeyBase58Check: publicKey,
      Username: entry?.ProfileEntryResponse.Username || "",
    };
  });

  return topNData;
}
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { number, interests } = await req.json();

    const supabaseClient = createServerComponentClient({
      cookies,
    });

    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser();

    console.log(userData, userError);

    if (userError)
      return new NextResponse(JSON.stringify("Error"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const { data: userInfo, error: selectError } = await supabase
      .from("profiles")
      .select()
      .eq("id", userData.user.id);

    console.log(selectError);

    if (selectError)
      return new NextResponse(JSON.stringify("Error"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const cachedData = cache.get("data");

    if (cachedData) {
      return new NextResponse(JSON.stringify(cachedData.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let interest;

    if (interests) {
      interest = interests;
    } else {
      if (userInfo[0].interests) {
        interest = JSON.parse(userInfo[0].interests).sub[0];
      } else {
        interest = "Deso";
      }
    }

    // Retrieve a list of people that post similar content to what the user is interested in
    const apiUrl = `https://cloutavista.com/posts?text=${
      interest ? interest : "eva"
    }&result_type=latest&size=10&page=1`;
    const response = await fetch(apiUrl);
    console.log(response);
    if (!response.ok) {
      return new NextResponse(JSON.stringify("Error"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const filteredData = findTopNPublicKeys(
      data,
      userData.user.user_metadata.deso_key,
      number
    );

    const newCachedData: CachedData = {
      data: filteredData,
    };
    cache.set("data", newCachedData);

    return new NextResponse(JSON.stringify(filteredData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    //}
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
