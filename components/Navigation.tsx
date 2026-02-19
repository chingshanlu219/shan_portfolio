"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";

export default function Navigation() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];

  if (pathname?.startsWith("/admin")) {
    return (
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/admin" className="font-semibold text-gray-900">
            Admin
          </Link>
          <Link href="/homepage" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回網站
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/homepage" className="font-semibold text-gray-900">
          {t.nav.homepage}
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/project"
            className={`text-sm ${pathname === "/project" ? "font-medium text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
          >
            {t.nav.project}
          </Link>
          <Link
            href="/sketch"
            className={`text-sm ${pathname === "/sketch" ? "font-medium text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
          >
            {t.nav.sketch}
          </Link>
          <Link
            href="/photography"
            className={`text-sm ${pathname === "/photography" ? "font-medium text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
          >
            {t.nav.photography}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
