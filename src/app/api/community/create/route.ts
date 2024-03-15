import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (req.method === "POST") {
      // Destructure and read the community creation details from the request body
      const { name, profilePic, banner, description, requirementsToJoin } =
        await req.json();

      const supabaseClient = createServerComponentClient({ cookies });

      // Ensure user is authenticated to create a community
      const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

      if (userError || !userData.user)
        throw new Error("User not authenticated");

      // Insert the new community details into the 'communities' table
      const { data: communityData, error: communityError } = await supabase
        .from("communities")
        .insert({
          id: generateUUID(),
          name,
          profile_pic: profilePic,
          banner,
          description,
          requirements_to_join: JSON.stringify(requirementsToJoin),
          owner_id: userData.user.id,
          members: [userData.user.id],
          channels: [{ type: "text", restricted: false, name: "General" }],
        })
        .select();

      if (communityError) {
        throw communityError;
      }

      // Assuming community creation was successful and we have the new community's ID
      const newCommunityId = communityData[0]?.id;

      // Fetch the user's current community list (assuming it's stored in a field called 'community_list')
      const { data: userProfile, error: userProfileError } = await supabase
        .from("profiles")
        .select("community_list")
        .eq("id", userData.user.id)
        .single();

      if (userProfileError) {
        console.log(userProfileError);
        throw userProfileError;
      }

      // Update the user's community list with the new community's ID
      const updatedCommunityList = [
        ...(userProfile.community_list ? userProfile.community_list : []),
        newCommunityId,
      ];
      console.log(userProfile.community_list);
      const { error: updateUserError } = await supabase
        .from("profiles")
        .update({ community_list: updatedCommunityList })
        .eq("id", userData.user.id);

      if (updateUserError) {
        console.log(updateUserError);
        throw updateUserError;
      }

      // Respond with the created community data
      return new NextResponse(JSON.stringify(communityData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // If not a POST request, return Method Not Allowed
      return new NextResponse(
        JSON.stringify({ message: "Method Not Allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in community creation or user update:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create community or update user" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
