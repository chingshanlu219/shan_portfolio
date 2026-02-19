"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/verify", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setIsAuthenticated(data.authenticated === true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        const data = await res.json();
        setError(data.error || "登錄失敗");
      }
    } catch {
      setError("登錄失敗，請稍後再試");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">管理員登錄</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              登錄
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">控制面板</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/homepage-pictures"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-900 mb-2">首頁圖片</h2>
            <p className="text-sm text-gray-500">
              管理 Marquee 橫向輪播圖片
            </p>
          </Link>
          <Link
            href="/admin/projects"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-900 mb-2">Projects</h2>
            <p className="text-sm text-gray-500">
              新增、編輯、刪除作品
            </p>
          </Link>
          <Link
            href="/admin/sketches"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-900 mb-2">Sketches</h2>
            <p className="text-sm text-gray-500">
              新增、編輯、刪除草圖
            </p>
          </Link>
          <Link
            href="/admin/photography"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-900 mb-2">Photography</h2>
            <p className="text-sm text-gray-500">
              新增、編輯、刪除攝影作品
            </p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
