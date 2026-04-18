import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:3001/users";

// ✅ GET USERS
export async function GET() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return NextResponse.json(data);
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