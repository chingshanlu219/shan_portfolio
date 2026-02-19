"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MediaDisplay } from "@/components/MediaDisplay";
import { formatYearSeason } from "@/lib/dateDisplay";

interface Project {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  coverImage: string;
  order: number;
  year?: number | null;
  season?: string | null;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個 Project 嗎？")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getTitle = (p: Project) =>
    p.title?.["zh-TW"] || p.title?.["en"] || Object.values(p.title || {})[0] || p.id;

  if (loading) {
    return <div className="text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">管理 Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          新增 Project
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
            <div
              key={proj.id}
              className="border rounded-lg overflow-hidden bg-white"
            >
              <div className="relative aspect-video bg-gray-100">
                <MediaDisplay
                  url={proj.coverImage || ""}
                  alt={getTitle(proj)}
                  unoptimized={proj.coverImage?.includes("cloudinary")}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{getTitle(proj)}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">/{proj.id}</p>
                {(proj.year || proj.season) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatYearSeason(proj.year, proj.season, "en")}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/admin/projects/${proj.id}`}
                    className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                  >
                    編輯
                  </Link>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          還沒有 Project，點擊「新增 Project」開始
        </div>
      )}
    </div>
  );
}
