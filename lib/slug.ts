import slugify from "slugify";

const SLUG_OPTIONS = {
  lower: true,
  strict: true,
  locale: "en",
};

/**
 * Generate URL-safe slug from text.
 * "My Architecture Design" -> "my-architecture-design"
 * "我的設計" -> "" (no ascii), fallback to prefix + timestamp
 */
export function generateSlug(text: string, prefix: string = "item"): string {
  const trimmed = (text || "").trim();
  const slug = slugify(trimmed, SLUG_OPTIONS);
  if (slug) return slug;
  return `${prefix}-${Date.now()}`;
}

/**
 * Ensure slug is unique in collection. If exists, append -2, -3, etc.
 */
export async function ensureUniqueSlug(
  db: { collection: (name: string) => { findOne: (q: object) => Promise<{ id: string } | null> } },
  collection: string,
  slug: string
): Promise<string> {
  let candidate = slug;
  let n = 2;
  while (true) {
    const existing = await db.collection(collection).findOne({ id: candidate });
    if (!existing) return candidate;
    candidate = `${slug}-${n}`;
    n++;
  }
}
