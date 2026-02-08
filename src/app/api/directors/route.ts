import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM diretores");
    return NextResponse.json(res.rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      "INSERT INTO diretores (name, email, password, role) VALUES ($1, $2, $3, 'director') RETURNING *",
      [name, email, password],
    );
    return NextResponse.json(res.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Updates name, email, optionally password
  const updates = [];
  const values = [];
  let query = "UPDATE diretores SET ";

  if (data.name) {
    updates.push("name");
    values.push(data.name);
  }
  if (data.email) {
    updates.push("email");
    values.push(data.email);
  }
  if (data.password) {
    updates.push("password");
    values.push(data.password);
  }

  // Construct dynamic query
  query += updates.map((col, i) => `${col} = $${i + 1}`).join(", ");
  query += ` WHERE id = $${values.length + 1} RETURNING *`;
  values.push(id);

  try {
    await client.connect();
    const res = await client.query(query, values);
    return NextResponse.json(res.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json(); // Or query param
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query("DELETE FROM diretores WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.end();
  }
}
