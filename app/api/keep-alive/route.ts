import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("produtos").select("id").limit(1);

    if (error) {
      console.error("Supabase keep-alive failed:", error.message);
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Supabase keep-alive failed:", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}