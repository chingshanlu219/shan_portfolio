"use client";

import { useRef } from "react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";
import { convertCloudinaryUrlToWebFormat, isPdfUrl } from "@/lib/cloudinary";

interface ImageUploadFieldProps {
  folder: string;
  currentImage?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploadField({
  folder,
  currentImage,
  onUploaded,
  label = "封面圖片",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    uploadFile,
    isUploading,
    isCompressing,
    error,
    handleFileSelect,
    upload,
    clear,
    setError,
  } = useImageUpload(folder);

  const handleUpload = async () => {
    const url = await upload();
    if (url) {
      onUploaded(url);
      clear();
      inputRef.current && (inputRef.current.value = "");
    }
  };

  const displayImage = currentImage;
  const isPdf = isPdfUrl(displayImage);
  const isCloudinary = displayImage?.includes("cloudinary");
  const imageSrc = displayImage && !isPdf
    ? isCloudinary
      ? convertCloudinaryUrlToWebFormat(displayImage)
      : displayImage
    : null;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-500">
        支援格式：.pdf, .png, .jpg, .jpeg。圖片超過 10MB 會自動壓縮；PDF 不可超過 10MB（不會壓縮），請先用
        <a href="https://www.smallpdf.com/compress-pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">線上工具</a>
        壓縮後再上傳。
      </p>
      {displayImage && (
        <>
          {isPdf ? (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <a
                href={displayImage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                開啟 PDF
              </a>
            </div>
          ) : (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageSrc || displayImage}
                alt=""
                fill
                className="object-cover"
                unoptimized={isCloudinary}
              />
            </div>
          )}
        </>
      )}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
        />
        {uploadFile && (
          <p className="mt-2 text-sm text-gray-500">
            已選擇: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || isCompressing || !uploadFile}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {isCompressing ? "壓縮中..." : isUploading ? "上傳中..." : "上傳"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600" onFocus={() => setError(null)}>
          {error}
        </p>
      )}
    </div>
  );
}
