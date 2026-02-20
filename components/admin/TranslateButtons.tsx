"use client";

import { useState } from "react";
import { LANGUAGES } from "@/lib/i18n";

type LangCode = string;

interface TranslateButtonsProps {
  title: Record<LangCode, string>;
  description: Record<LangCode, string>;
  content: Record<LangCode, string>;
  onUpdate: (key: "title" | "description" | "content", lang: LangCode, value: string) => void;
}

export function TranslateButtons({
  title,
  description,
  content,
  onUpdate,
}: TranslateButtonsProps) {
  const [sourceLang, setSourceLang] = useState<LangCode>("zh-TW");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (source: string, target: LangCode, text: string): Promise<string> => {
    if (!text.trim()) return "";
    const res = await fetch("/api/admin/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceLang: source,
        targetLang: target,
        text: text.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "翻譯失敗");
    return data.translatedText || "";
  };

  const handleTranslateBlank = async () => {
    setTranslating(true);
    setError(null);
    try {
      const src = sourceLang;
      const srcTitle = title[src] || "";
      const srcDesc = description[src] || "";
      const srcContent = content[src] || "";
      if (!srcTitle && !srcDesc && !srcContent) {
        setError("請先填寫來源語言的標題、描述或內容");
        return;
      }
      for (const { code } of LANGUAGES) {
        if (code === src) continue;
        if (!title[code] && srcTitle) {
          const t = await translate(src, code, srcTitle);
          if (t) onUpdate("title", code, t);
        }
        if (!description[code] && srcDesc) {
          const t = await translate(src, code, srcDesc);
          if (t) onUpdate("description", code, t);
        }
        if (!content[code] && srcContent) {
          const t = await translate(src, code, srcContent);
          if (t) onUpdate("content", code, t);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-2">AI 翻譯（MyMemory 免費）</h3>
      <p className="text-xs text-gray-500 mb-2">
        會翻譯標題、描述、內容到所有空白語言。
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">來源語言：</span>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {LANGUAGES.map(({ code }) => (
              <option key={code} value={code}>
                {code === "zh-TW" ? "繁中" : code === "zh-CN" ? "簡中" : code.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={handleTranslateBlank}
          disabled={translating}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
        >
          {translating ? "翻譯中..." : "翻譯所有空白"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
