import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const db = await getDb();
    const item = await db.collection("projects").findOne({ id });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...item,
      createdAt: item.createdAt?.toISOString?.() ?? null,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

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
    const db = await getDb();
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.description !== undefined) update.description = body.description;
    if (body.coverImage !== undefined) update.coverImage = body.coverImage;
    if (body.images !== undefined) update.images = body.images;
    if (body.content !== undefined) update.content = body.content;
    if (body.order !== undefined) update.order = body.order;
    if (body.year !== undefined) update.year = body.year != null ? Number(body.year) : null;
    if (body.season !== undefined) update.season = ["spring", "summer", "fall", "winter"].includes(body.season) ? body.season : null;
    const result = await db
      .collection("projects")
      .findOneAndUpdate(
        { id },
        { $set: update },
        { returnDocument: "after" }
      );
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...result,
      createdAt: result.createdAt?.toISOString?.() ?? null,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection("projects").deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
