import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
