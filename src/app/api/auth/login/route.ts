import { NextResponse } from "next/server";
import { Pool } from "pg";

// Use Pool instead of Client for better connection management in serverless
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  const { email, password } = await req.json();

  let client;
  try {
    client = await pool.connect();

    // Queries em paralelo para performance
    const [resOwner, resManager, resDirector] = await Promise.all([
      client.query(
        "SELECT * FROM public.users WHERE email = $1 AND password = $2",
        [email, password],
      ),
      client.query(
        "SELECT * FROM gerentes WHERE email = $1 AND password = $2",
        [email, password],
      ),
      client.query(
        "SELECT * FROM diretores WHERE email = $1 AND password = $2",
        [email, password],
      ),
    ]);

    // Check Owner first
    if (resOwner.rows.length > 0) {
      const user = resOwner.rows[0];
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
      // Outros users na tabela publica
      return NextResponse.json({
        user: { ...user, user_metadata: { role: user.role || "owner" } },
        session: {
          access_token: `token-${user.id}`,
          user: { ...user, user_metadata: { role: user.role || "owner" } },
        },
      });
    }

    // Check Manager
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

    // Check Director
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
    if (client) client.release();
  }
}
