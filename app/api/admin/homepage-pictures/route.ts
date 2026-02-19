import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const db = await getDb();
    const items = await db
      .collection("homepage_pictures")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching homepage pictures:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const { imageUrl } = body;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }
    const db = await getDb();
    const count = await db.collection("homepage_pictures").countDocuments();
    const id = `hp-${Date.now()}`;
    const doc = {
      id,
      imageUrl,
      order: count,
    };
    await db.collection("homepage_pictures").insertOne(doc);
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error creating homepage picture:", error);
    return NextResponse.json(
      { error: "Failed to create" },
      { status: 500 }
    );
  }
}
