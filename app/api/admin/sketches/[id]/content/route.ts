import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json();
    const { content } = body;
    const db = await getDb();
    const sketch = await db.collection("sketches").findOne({ id });
    if (!sketch) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const currentContent = (sketch.content as Record<string, string>) || {};
    const merged = typeof content === "object" ? { ...currentContent, ...content } : currentContent;
    await db.collection("sketches").updateOne(
      { id },
      { $set: { content: merged } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating sketch content:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
