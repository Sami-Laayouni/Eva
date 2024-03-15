import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Parse the request body to get the community ID
    const { communityId } = await req.json();

    if (!communityId) {
      // Return 400 Bad Request if the community ID is not provided
      return new NextResponse(
        JSON.stringify({ message: "Community ID Not found" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch the community details by ID from the 'communities' table
    const { data: community, error } = await supabase
      .from("communities")
      .select(
        "id, name, description, profile_pic, banner, requirements_to_join, owner_id, members, channels"
      )
      .eq("id", communityId)
      .single();

    if (error) {
      return new NextResponse(JSON.stringify({ message: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the community details as the response
    return new NextResponse(JSON.stringify(community), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return 500 Internal Server Error for any server errors
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
