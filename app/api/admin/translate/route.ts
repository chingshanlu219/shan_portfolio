import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

/** Map our language codes to MyMemory format */
const LANG_MAP: Record<string, string> = {
  "zh-TW": "zh-TW",
  "zh-CN": "zh-CN",
  en: "en",
  fr: "fr",
  es: "es",
};

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const { sourceLang, targetLang, text } = body;
    if (!sourceLang || !targetLang || typeof text !== "string") {
      return NextResponse.json(
        { error: "sourceLang, targetLang, text are required" },
        { status: 400 }
      );
    }
    const src = LANG_MAP[sourceLang] || sourceLang;
    const tgt = LANG_MAP[targetLang] || targetLang;
    if (src === tgt) {
      return NextResponse.json({ translatedText: text });
    }
    const params = new URLSearchParams({
      q: text,
      langpair: `${src}|${tgt}`,
    });
    const res = await fetch(`${MYMEMORY_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (data.responseStatus !== 200) {
      return NextResponse.json(
        { error: data.responseDetails || "Translation failed" },
        { status: 500 }
      );
    }
    if (data.quotaFinished) {
      return NextResponse.json(
        { error: "每日翻譯額度已用完（免費 5000 字/日），明日再試" },
        { status: 429 }
      );
    }
    const translated = data.responseData?.translatedText ?? "";
    return NextResponse.json({ translatedText: translated });
  } catch (error) {
    console.error("Translate error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
