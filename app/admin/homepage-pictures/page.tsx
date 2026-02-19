"use client";

import { useState, useEffect } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Image from "next/image";
import { convertCloudinaryUrlToWebFormat } from "@/lib/cloudinary";

interface HomepagePicture {
  id: string;
  imageUrl: string;
  order: number;
}

export default function AdminHomepagePicturesPage() {
  const [pictures, setPictures] = useState<HomepagePicture[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPictures = () => {
    fetch("/api/admin/homepage-pictures")
      .then((r) => r.json())
      .then(setPictures)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  const handleUploaded = async (url: string) => {
    const res = await fetch("/api/admin/homepage-pictures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url }),
    });
    if (res.ok) {
      setSuccess("已新增圖片");
      fetchPictures();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這張圖片嗎？")) return;
    const res = await fetch(`/api/admin/homepage-pictures/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccess("已刪除");
      fetchPictures();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading) {
    return <div className="text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">管理首頁圖片</h1>
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">新增圖片</h2>
          <ImageUploadField
            folder="homepage"
            onUploaded={handleUploaded}
            label="上傳 Marquee 圖片"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            目前圖片 ({pictures.length})
          </h2>
          <div className="flex flex-wrap gap-4">
            {pictures.map((pic) => {
              const isCloudinary = pic.imageUrl?.includes("cloudinary");
              const src = isCloudinary
                ? convertCloudinaryUrlToWebFormat(pic.imageUrl)
                : pic.imageUrl;
              return (
                <div
                  key={pic.id}
                  className="relative w-48 h-36 rounded overflow-hidden border group"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={isCloudinary}
                  />
                  <button
                    onClick={() => handleDelete(pic.id)}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    刪除
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
