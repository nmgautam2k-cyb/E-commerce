import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.JSON_SERVER_URL || "http://localhost:5000/users";

// ✅ GET USERS
export async function GET() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// ✅ ADD USER
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}