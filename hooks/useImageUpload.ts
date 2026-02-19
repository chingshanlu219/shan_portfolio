"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";

const MAX_SIZE = 10485760; // 10MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function useImageUpload(folder: string) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compressIfNeeded = useCallback(async (file: File): Promise<File> => {
    if (!isImageFile(file)) return file;
    if (file.size <= MAX_SIZE) return file;
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 3840,
        useWebWorker: true,
        fileType: file.type,
        initialQuality: 0.92,
      };
      let compressed = await imageCompression(file, options);
      if (compressed.size > MAX_SIZE) {
        compressed = await imageCompression(file, {
          ...options,
          initialQuality: 0.85,
          maxWidthOrHeight: 2560,
        });
      }
      return compressed;
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      const validType = ACCEPTED_TYPES.includes(file.type) ||
        file.name.toLowerCase().match(/\.(pdf|png|jpg|jpeg)$/);
      if (!validType) {
        setError("僅支援 .pdf, .png, .jpg, .jpeg 格式");
        return;
      }
      const processed = await compressIfNeeded(file);
      setUploadFile(processed);
    },
    [compressIfNeeded]
  );

  const upload = useCallback(async (): Promise<string | null> => {
    if (!uploadFile) {
      setError("請先選擇檔案");
      return null;
    }
    if (uploadFile.size > MAX_SIZE && !isImageFile(uploadFile)) {
      setError("PDF 檔案不可超過 10MB（PDF 不會自動壓縮）。請使用 smallpdf.com 等線上工具壓縮後再上傳。");
      return null;
    }
    setIsUploading(true);
    setError(null);
    try {
      let fileToUpload = uploadFile;
      if (isImageFile(uploadFile) && uploadFile.size > MAX_SIZE) {
        fileToUpload = await compressIfNeeded(uploadFile);
      }
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "上傳失敗");
      }
      const data = await res.json();
      const url = data.url || data.secure_url;
      setUploadFile(null);
      return url;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile, folder, compressIfNeeded]);

  const clear = useCallback(() => {
    setUploadFile(null);
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    isCompressing,
    error,
    handleFileSelect,
    upload,
    clear,
    setError,
  };
}
