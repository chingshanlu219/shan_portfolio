"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`text-xs px-2 py-1 rounded ${
            language === code ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
