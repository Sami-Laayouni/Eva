import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await supabase.auth.signOut().then((response) => {
      console.log("Sign-out response:", response);
    });

    return new NextResponse(
      { body: "Success" },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating:", error);
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
