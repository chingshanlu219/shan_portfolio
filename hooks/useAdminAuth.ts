"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/verify", { cache: "no-store" });
      const data = await res.json();
      return data.authenticated === true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    checkAuth().then((auth) => {
      if (!cancelled) {
        setIsAuthenticated(auth);
        if (!auth) {
          router.replace("/admin");
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [checkAuth, router]);

  return { isAuthenticated, checkAuth };
}
