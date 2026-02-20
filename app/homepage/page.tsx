"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { convertCloudinaryUrlToWebFormat, getPdfPreviewUrl, isPdfUrl } from "@/lib/cloudinary";
import { formatYearSeason, getSeasonLang } from "@/lib/dateDisplay";

interface HomepagePicture {
  id: string;
  imageUrl: string;
  order: number;
}

interface Project {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  coverImage: string;
  order: number;
  year?: number | null;
  season?: string | null;
}

export default function HomepagePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [pictures, setPictures] = useState<HomepagePicture[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/homepage-pictures").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([pics, projs]) => {
        setPictures(Array.isArray(pics) ? pics : []);
        setProjects(Array.isArray(projs) ? projs : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const previewProjects = projects.slice(0, 6);
  const getLocalized = (obj: Record<string, string>) =>
    obj[language] || obj["en"] || obj["zh-TW"] || Object.values(obj)[0] || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {pictures.length > 0 && (
        <div className="h-screen overflow-hidden">
          <div className="flex animate-marquee w-max h-full items-stretch">
            {[...pictures, ...pictures].map((pic) => {
              const isPdf = isPdfUrl(pic.imageUrl);
              const pdfPreviewUrl = isPdf ? getPdfPreviewUrl(pic.imageUrl) : null;
              const isCloudinary = pic.imageUrl?.includes("cloudinary");
              const src = !isPdf
                ? isCloudinary
                  ? convertCloudinaryUrlToWebFormat(pic.imageUrl)
                  : pic.imageUrl
                : pdfPreviewUrl;
              const showPdfIcon = isPdf && !pdfPreviewUrl;
              return (
                <div
                  key={`${pic.id}-${pic.order}`}
                  className="flex-shrink-0 h-full aspect-[4/3] mx-2 relative rounded-lg overflow-hidden bg-gray-100"
                >
                  {showPdfIcon ? (
                    <a
                      href={pic.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <span className="text-4xl">📄</span>
                    </a>
                  ) : (
                    <Image
                      src={src || "/placeholder.svg"}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="256px"
                      unoptimized={isCloudinary || !!pdfPreviewUrl}
                    />
                  )}
                  {isPdf && pdfPreviewUrl && (
                    <a
                      href={pic.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {t.project.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewProjects.map((proj) => {
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
                className="group block rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition"
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
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-600">
                    {getLocalized(proj.title)}
                  </h3>
                  {(proj.year || proj.season) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatYearSeason(proj.year, proj.season, getSeasonLang(language))}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {getLocalized(proj.description)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {projects.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/project"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {t.homepage.viewAllProjects}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
