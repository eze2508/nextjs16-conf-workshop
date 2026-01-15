import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!tag) {
    return Response.json({ error: "Tag is required" }, { status: 400 });
  }
  revalidateTag(tag, "max");
  return Response.json({ message: "Revalidated" });
}