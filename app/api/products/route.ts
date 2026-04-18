import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("http://localhost:3001/products");
    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    const response = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    const newProduct = await response.json();
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}