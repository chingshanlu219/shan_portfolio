"use client";

import Image from "next/image";
import { convertCloudinaryUrlToWebFormat, getPdfPreviewUrl, isPdfUrl } from "@/lib/cloudinary";

interface MediaDisplayProps {
  url: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export function MediaDisplay({
  url,
  alt,
  fill = true,
  className = "object-cover",
  priority,
  unoptimized,
  onError,
}: MediaDisplayProps) {
  const isPdf = isPdfUrl(url);
  const isCloudinary = url?.includes("cloudinary");
  const src = url && !isPdf
    ? isCloudinary
      ? convertCloudinaryUrlToWebFormat(url)
      : url
    : "/placeholder.svg";

  if (isPdf) {
    const previewUrl = getPdfPreviewUrl(url);
    if (previewUrl) {
      return (
        <div className="absolute inset-0 group">
          <Image
            src={previewUrl}
            alt={alt}
            fill={fill}
            className={className}
            priority={priority}
            unoptimized
            onError={onError}
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors opacity-0 hover:opacity-100"
          >
            <span className="px-4 py-2 bg-white rounded text-sm text-gray-800 font-medium shadow">
              開啟 PDF
            </span>
          </a>
        </div>
      );
    }
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100">
        <span className="text-4xl text-gray-400">📄</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          開啟 PDF
        </a>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
      onError={onError}
    />
  );
}
