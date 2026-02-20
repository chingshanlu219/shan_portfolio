"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { convertCloudinaryUrlToWebFormat, getPdfPreviewUrl, isPdfUrl } from "@/lib/cloudinary";
import { formatYearSeason, getSeasonLang } from "@/lib/dateDisplay";

interface Project {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  coverImage: string;
  order: number;
  year?: number | null;
  season?: string | null;
}

export default function ProjectListPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getLocalized = (obj: Record<string, string>) =>
    obj?.[language] || obj?.["en"] || obj?.["zh-TW"] || Object.values(obj || {})[0] || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.project.title}</h1>
        <p className="text-gray-600 mb-12">{t.project.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => {
            const isPdf = isPdfUrl(proj.coverImage);
            const pdfPreviewUrl = isPdf ? getPdfPreviewUrl(proj.coverImage) : null;
            const isCloudinary = proj.coverImage?.includes("cloudinary");
            const src = proj.coverImage && !isPdf
              ? isCloudinary
                ? convertCloudinaryUrlToWebFormat(proj.coverImage)
                : proj.coverImage
              : pdfPreviewUrl || "/placeholder.svg";
            const showPdfIcon = isPdf && !pdfPreviewUrl;
            return (
              <Link
                key={proj.id}
                href={`/project/${proj.id}`}
                className="group block rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  {showPdfIcon ? (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-400">📄</div>
                  ) : (
                  <Image
                    src={src}
                    alt={getLocalized(proj.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={isCloudinary || !!pdfPreviewUrl}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-600">
                    {getLocalized(proj.title)}
                  </h3>
                  {(proj.year || proj.season) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatYearSeason(proj.year, proj.season, getSeasonLang(language))}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                    {getLocalized(proj.description)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No projects yet.
          </div>
        )}
      </div>
    </div>
  );
}
