export async function POST(req) {
  const { username, password } = await req.json();

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return Response.json({ success: true });
  }

  return Response.json({ success: false });
}