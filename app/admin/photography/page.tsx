"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MediaDisplay } from "@/components/MediaDisplay";
import { formatYearSeason } from "@/lib/dateDisplay";

interface Photography {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  coverImage: string;
  order: number;
  year?: number | null;
  season?: string | null;
}

export default function AdminPhotographyPage() {
  const [items, setItems] = useState<Photography[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/photography")
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個 Photography 嗎？")) return;
    const res = await fetch(`/api/admin/photography/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const getTitle = (p: Photography) =>
    p.title?.["zh-TW"] || p.title?.["en"] || Object.values(p.title || {})[0] || p.id;

  if (loading) {
    return <div className="text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">管理 Photography</h1>
        <Link
          href="/admin/photography/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          新增 Photography
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden bg-white"
            >
              <div className="relative aspect-video bg-gray-100">
                <MediaDisplay
                  url={item.coverImage || ""}
                  alt={getTitle(item)}
                  unoptimized={item.coverImage?.includes("cloudinary")}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{getTitle(item)}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">/{item.id}</p>
                {(item.year || item.season) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatYearSeason(item.year, item.season, "en")}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/admin/photography/${item.id}`}
                    className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                  >
                    編輯
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          還沒有 Photography，點擊「新增 Photography」開始
        </div>
      )}
    </div>
  );
}
