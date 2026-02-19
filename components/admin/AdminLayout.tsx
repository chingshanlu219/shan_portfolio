"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const links = [
    { href: "/admin", label: "控制面板" },
    { href: "/admin/homepage-pictures", label: "首頁圖片" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/sketches", label: "Sketches" },
    { href: "/admin/photography", label: "Photography" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Admin</h2>
        </div>
        <nav className="flex-1 p-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded text-sm ${
                pathname === link.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            登出
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
