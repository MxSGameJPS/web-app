import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Check Owner in Database (table 'users')
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // O dono deve estar na tabela 'users' com email dono@admin.com
    const resOwner = await client.query(
      "SELECT * FROM public.users WHERE email = $1 AND password = $2",
      [email, password],
    );
    if (resOwner.rows.length > 0) {
      const user = resOwner.rows[0];
      const role = user.role || "owner"; // Fallback to owner if role is null for the specific user

      // Se o login for dono@admin.com, garantimos role 'owner'
      if (email === "dono@admin.com") {
        return NextResponse.json({
          user: { ...user, user_metadata: { role: "owner" } },
          session: {
            access_token: `token-owner-${user.id}`,
            user: { ...user, user_metadata: { role: "owner" } },
          },
        });
      }
    }

    // ... (rest of checks for managers/directors)

    // Check Gerentes
    const resManager = await client.query(
      "SELECT * FROM gerentes WHERE email = $1 AND password = $2",
      [email, password],
    );
    if (resManager.rows.length > 0) {
      const user = resManager.rows[0];
      return NextResponse.json({
        user: { ...user, user_metadata: { role: user.role } },
        session: {
          access_token: `token-${user.id}`,
          user: { ...user, user_metadata: { role: user.role } },
        },
      });
    }

    // Check Diretores
    const resDirector = await client.query(
      "SELECT * FROM diretores WHERE email = $1 AND password = $2",
      [email, password],
    );
    if (resDirector.rows.length > 0) {
      const user = resDirector.rows[0];
      return NextResponse.json({
        user: { ...user, user_metadata: { role: user.role } },
        session: {
          access_token: `token-${user.id}`,
          user: { ...user, user_metadata: { role: user.role } },
        },
      });
    }

    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 },
    );
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  } finally {
    await client.end();
  }
}
