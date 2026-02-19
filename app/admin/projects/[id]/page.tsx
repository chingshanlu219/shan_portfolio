"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { TranslateButtons } from "@/components/admin/TranslateButtons";
import { LANGUAGES } from "@/lib/i18n";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

function AdminProjectEditContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [title, setTitle] = useState<Record<string, string>>({});
  const [description, setDescription] = useState<Record<string, string>>({});
  const [year, setYear] = useState<number | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [newId, setNewId] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || {});
        setDescription(data.description || {});
        setYear(data.year ?? null);
        setSeason(data.season ?? null);
        setCoverImage(data.coverImage || "");
        setImages(data.images || []);
        setContent(data.content || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const finalId = isNew ? (newId?.trim() || undefined) : id;
      if (isNew) {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: finalId || "",
            title,
            description,
            year,
            season,
            coverImage,
            images,
            content,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "創建失敗");
        }
        setSuccess("已創建");
        setTimeout(() => router.push("/admin/projects"), 2000);
      } else {
        const res = await fetch(`/api/admin/projects/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            year,
            season,
            coverImage,
            images,
            content,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "更新失敗");
        }
        setSuccess("已保存");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const updateLocalized = (
    key: "title" | "description" | "content",
    lang: string,
    value: string
  ) => {
    if (key === "title") setTitle((t) => ({ ...t, [lang]: value }));
    if (key === "description") setDescription((d) => ({ ...d, [lang]: value }));
    if (key === "content") setContent((c) => ({ ...c, [lang]: value }));
  };

  if (loading) return <div className="text-gray-500">載入中...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/projects")}
          className="text-blue-600 hover:text-blue-800"
        >
          ← 返回 Projects
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isNew ? "新增 Project" : "編輯 Project"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年份
          </label>
          <input
            type="number"
            min={1900}
            max={2100}
            placeholder="例如 2024"
            value={year ?? ""}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            季度
          </label>
          <select
            value={season ?? ""}
            onChange={(e) => setSeason(e.target.value || null)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">— 不選 —</option>
            <option value="spring">Spring 春</option>
            <option value="summer">Summer 夏</option>
            <option value="fall">Fall 秋</option>
            <option value="winter">Winter 冬</option>
          </select>
        </div>
      </div>

      {isNew && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug（英文，必填）<span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">網址用於 /project/xxx，填寫英文或從英文標題自動產生</p>
          <input
            type="text"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="例如 my-architecture-design"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )}

      <div className="mb-6">
        <ImageUploadField
          folder={`projects/${isNew ? (newId || `temp-${Date.now()}`) : id}`}
          currentImage={coverImage}
          onUploaded={setCoverImage}
        />
      </div>

      <TranslateButtons
        title={title}
        description={description}
        content={content}
        onUpdate={updateLocalized}
      />

      {LANGUAGES.map(({ code }) => (
        <div key={code} className="mb-6 border-b pb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {code === "zh-TW" ? "繁中" : code === "zh-CN" ? "簡中" : code.toUpperCase()}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">標題</label>
              <input
                type="text"
                value={title[code] || ""}
                onChange={(e) => updateLocalized("title", code, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">描述</label>
              <textarea
                value={description[code] || ""}
                onChange={(e) =>
                  updateLocalized("description", code, e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">內容 (HTML)</label>
              {typeof window !== "undefined" && (
                <ReactQuill
                  theme="snow"
                  value={content[code] || ""}
                  onChange={(v) => updateLocalized("content", code, v)}
                  style={{ minHeight: "200px" }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "保存中..." : isNew ? "創建" : "保存"}
      </button>
    </div>
  );
}

export default function AdminProjectEditPage() {
  return (
    <Suspense fallback={<div className="text-gray-500">載入中...</div>}>
      <AdminProjectEditContent />
    </Suspense>
  );
}
