"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="border-t mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        {t.footer.copyright} {new Date().getFullYear()}
      </div>
    </footer>
  );
}
