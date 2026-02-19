import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const items = await db
      .collection("projects")
      .find({})
      .sort({ order: 1 })
      .toArray();
    const serialized = items.map((item) => ({
      ...item,
      createdAt: item.createdAt?.toISOString?.() ?? null,
    }));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}
