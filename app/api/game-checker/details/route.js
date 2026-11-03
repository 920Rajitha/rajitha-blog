import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cleanRequirementHtml(value) {
  if (!value || typeof value !== "string") return "";
  return value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(li|p|div|h\d)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("id");
  if (!/^\d{1,10}$/.test(appId || "")) return NextResponse.json({ error: "Invalid game ID." }, { status: 400 });

  try {
    const url = new URL("https://store.steampowered.com/api/appdetails/");
    url.searchParams.set("appids", appId);
    url.searchParams.set("l", "english");
    url.searchParams.set("cc", "us");
    const response = await fetch(url, {
      headers: { "User-Agent": "RajithaBlogGameChecker/1.0" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Steam details returned ${response.status}`);
    const payload = await response.json();
    const game = payload?.[appId];
    if (!game?.success || !game?.data) return NextResponse.json({ error: "Steam does not have details for this game." }, { status: 404 });

    const data = game.data;
    const requirements = data.pc_requirements || {};
    return NextResponse.json({
      id: Number(appId), name: data.name || "Selected game",
      steamUrl: `https://store.steampowered.com/app/${appId}/`,
      minimum: cleanRequirementHtml(requirements.minimum),
      recommended: cleanRequirementHtml(requirements.recommended),
      hasRequirements: Boolean(requirements.minimum || requirements.recommended),
    }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch (error) {
    console.error("Game details error:", error);
    return NextResponse.json({ error: "Could not load this game's requirements right now." }, { status: 502 });
  }
}
