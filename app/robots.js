import { NextResponse } from "next/server";

export default function robots() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://rajitha.blog/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
