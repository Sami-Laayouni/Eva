import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (req.method === "POST") {
      const { content_moderation, interests, deso_key } = await req.json();

      const supabaseClient = createServerComponentClient({
        cookies,
      });

      const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

      if (userError) return;

      const { data, error } = await supabase
        .from("profiles")
        .update({
          content_moderation: JSON.stringify(content_moderation),
          interests: JSON.stringify(interests),
          deso_key: JSON.stringify(deso_key),
          points: 0,
        })
        .eq("id", userData.user.id);

      if (error) {
        console.log(error);
        throw error;
      }

      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Method Not Allowed" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error updating:", error);
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
