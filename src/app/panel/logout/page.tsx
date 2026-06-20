"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PanelLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // حذف توکن از localStorage
    localStorage.removeItem("panelToken");
    
    // حذف کوکی (اگر از کوکی استفاده می‌کنید)
    document.cookie = "panelToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // هدایت به صفحه لاگین بعد از 1 ثانیه
    const timer = setTimeout(() => {
      router.push("/panel/login");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          در حال خروج از پنل...
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          لطفاً کمی صبر کنید
        </p>
      </div>
    </div>
  );
}