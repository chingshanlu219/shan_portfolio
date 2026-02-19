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
    const project = await db.collection("projects").findOne({ id });
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const currentContent = (project.content as Record<string, string>) || {};
    const merged = typeof content === "object" ? { ...currentContent, ...content } : currentContent;
    await db.collection("projects").updateOne(
      { id },
      { $set: { content: merged } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project content:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
