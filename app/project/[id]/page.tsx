"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { MediaDisplay } from "@/components/MediaDisplay";
import { formatYearSeason, getSeasonLang } from "@/lib/dateDisplay";

interface Project {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  coverImage: string;
  images: string[];
  content: Record<string, string>;
  year?: number | null;
  season?: string | null;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { language } = useLanguage();
  const t = translations[language];
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  const getLocalized = (obj: Record<string, string>) =>
    obj?.[language] || obj?.["en"] || obj?.["zh-TW"] || Object.values(obj || {})[0] || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t.common.loading}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not found</h1>
          <Link href="/project" className="text-blue-600 hover:underline">
            {t.project.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/project"
          className="inline-block text-gray-600 hover:text-gray-900 mb-6"
        >
          {t.project.backToList}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {getLocalized(project.title)}
          {(project.year || project.season) && (
            <span className="ml-3 text-xl font-normal text-gray-500">
              {formatYearSeason(project.year, project.season, getSeasonLang(language))}
            </span>
          )}
        </h1>
        <p className="text-gray-600 mb-8">{getLocalized(project.description)}</p>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 mb-8">
          <MediaDisplay
            url={project.coverImage || ""}
            alt={getLocalized(project.title)}
            priority
            unoptimized={project.coverImage?.includes("cloudinary")}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                >
                  <MediaDisplay
                    url={url}
                    alt={`${getLocalized(project.title)} ${i + 1}`}
                    unoptimized={url?.includes("cloudinary")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: getLocalized(project.content) || "<p>No content.</p>",
          }}
        />
      </div>
    </div>
  );
}
