export async function POST(req) {
  const { username, password } = await req.json();

  // 🔥 change this to your own
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "920@Rajitha";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return Response.json({ success: true });
  }

  return Response.json({ success: false });
}