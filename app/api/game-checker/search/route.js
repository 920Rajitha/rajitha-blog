import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  if (query.length < 2) return NextResponse.json({ error: "Enter at least 2 characters." }, { status: 400 });
  if (query.length > 80) return NextResponse.json({ error: "Search query is too long." }, { status: 400 });

  try {
    const url = new URL("https://store.steampowered.com/api/storesearch/");
    url.searchParams.set("term", query);
    url.searchParams.set("l", "english");
    url.searchParams.set("cc", "us");
    const response = await fetch(url, {
      headers: { "User-Agent": "RajithaBlogGameChecker/1.0" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Steam search returned ${response.status}`);
    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    return NextResponse.json(
      { results: items.slice(0, 8).map((item) => ({ id: Number(item.id), name: item.name, image: item.tiny_image || null })) },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("Game search error:", error);
    return NextResponse.json({ error: "Game search is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
