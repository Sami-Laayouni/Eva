"use server";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const supabaseClient = createServerComponentClient({
      cookies,
    });

    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser();

    const { data: userInfo, error: selectError } = await supabase
      .from("profiles")
      .select()
      .eq("id", userData.user.id);

    console.log(userInfo);
    let interest;

    if (userInfo[0].interests) {
      interest = JSON.parse(userInfo[0].interests).sub[0];
    } else {
      interest = "Deso";
    }

    console.log(interest);

    // Fetch data from the external API
    const outerCircle = `https://cloutavista.com/posts?text=${interest}&result_type=latest&size=10&min_likes=1&page=1`;
    const outerCircleResponse = await fetch(outerCircle);

    console.log(outerCircleResponse);

    if (!outerCircleResponse.ok) {
      throw new Error(`Failed to fetch data`);
    }

    const outerCircleData = await outerCircleResponse.json();
    console.log(outerCircleData);

    return new NextResponse(JSON.stringify(outerCircleData.data), {
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
