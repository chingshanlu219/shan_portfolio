import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
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

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    let { id, title, description, coverImage, images, content, order, year, season } = body;
    const db = await getDb();
    if (!id || typeof id !== "string" || !id.trim()) {
      const titleForSlug = title?.en || title?.["zh-TW"] || title?.["zh-CN"] || Object.values(title || {})[0] || "";
      id = generateSlug(titleForSlug, "project");
      if (!id || /^project-\d+$/.test(id)) {
        return NextResponse.json(
          { error: "Slug（英文，必填）：請填寫或先填寫英文標題以自動產生" },
          { status: 400 }
        );
      }
      id = await ensureUniqueSlug(db, "projects", id);
    } else {
      id = id.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "";
      if (!id) {
        return NextResponse.json(
          { error: "Slug（英文，必填）：請填寫有效的英文網址，例如 my-design" },
          { status: 400 }
        );
      }
      id = await ensureUniqueSlug(db, "projects", id);
    }
    const count = await db.collection("projects").countDocuments();
    const doc = {
      id,
      title: title || {},
      description: description || {},
      coverImage: coverImage || "",
      images: images || [],
      content: content || {},
      order: order ?? count,
      year: year != null ? Number(year) : null,
      season: ["spring", "summer", "fall", "winter"].includes(season) ? season : null,
      createdAt: new Date(),
    };
    await db.collection("projects").insertOne(doc);
    return NextResponse.json({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create" },
      { status: 500 }
    );
  }
}
