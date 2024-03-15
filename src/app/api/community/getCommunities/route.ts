// Import necessary modules and initialize the Supabase client
import { supabase } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // Ensure the request is a GET request
    if (req.method !== "GET") {
      return new NextResponse(
        JSON.stringify({ message: "Method Not Allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createServerComponentClient({ cookies });

    // Ensure user is authenticated
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser();

    if (userError || !userData.user)
      return new NextResponse(
        JSON.stringify({ error: "User not authenticated" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );

    // Fetch the user profile to get the community list
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("community_list")
      .eq("id", userData.user.id)
      .single();

    if (profileError || !userProfile) {
      console.error("Error fetching user profile:", profileError);
      throw new Error("Failed to fetch user profile");
    }

    // Fetch user's communities by their ID
    const { data: userCommunities, error: communitiesError } = await supabase
      .from("communities")
      .select(
        "id, name, description, profile_pic, banner, requirements_to_join"
      )
      .in("id", userProfile.community_list); // Use the fetched community list

    if (communitiesError) {
      console.error("Error fetching communities:", communitiesError);
      throw new Error("Failed to fetch communities");
    }

    // Respond with the user's communities
    return new NextResponse(JSON.stringify(userCommunities), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in the API:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch communities or user profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
