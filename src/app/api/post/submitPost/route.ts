import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (req.method === "POST") {
      const { id, text, deso_uid, author_id } = await req.json();

      // Insert a new row into the 'posts' table
      const { data, error } = await supabase.from("post").insert({
        id: id,
        text: text,
        deso_uid: deso_uid,
        author_id: author_id,
      });

      if (error) {
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
    console.error("Error creating a new post:", error);
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
