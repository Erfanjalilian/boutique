"use client";

import { useState, useEffect } from "react";

interface AboutData {
  description: string;
  story: string;
  mission: string;
  vision: string;
  additionalContent: string;
}

export default function AboutManagementPage() {
  const [data, setData] = useState<AboutData>({
    description: "",
    story: "",
    mission: "",
    vision: "",
    additionalContent: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // بارگذاری اطلاعات
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setFetching(true);
    try {
      const response = await fetch("/api/about");
      const result = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error loading about data:", error);
      setMessage({ text: "خطا در بارگذاری اطلاعات", type: "error" });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // بررسی اینکه آیا اطلاعات وجود دارد یا نه
      const checkResponse = await fetch("/api/about");
      const checkResult = await checkResponse.json();
      
      let response;
      // اگر اطلاعات وجود دارد، از PUT استفاده کن (برای به‌روزرسانی)
      if (checkResult.success && checkResult.data && 
          (checkResult.data.description || checkResult.data.story)) {
        response = await fetch("/api/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // اگر اطلاعات وجود ندارد، از POST استفاده کن (برای ایجاد)
        response = await fetch("/api/about", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        setMessage({ text: "✅ اطلاعات با موفقیت ذخیره شد", type: "success" });
        // به‌روزرسانی داده‌ها
        setData(result.data);
      } else {
        setMessage({ text: result.message || "❌ خطا در ذخیره اطلاعات", type: "error" });
      }
    } catch (error) {
      console.error("Error saving about data:", error);
      setMessage({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("آیا از حذف تمام اطلاعات مطمئن هستید؟")) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/about", {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        setData({
          description: "",
          story: "",
          mission: "",
          vision: "",
          additionalContent: ""
        });
        setMessage({ text: "✅ اطلاعات با موفقیت حذف شد", type: "success" });
      } else {
        setMessage({ text: result.message || "❌ خطا در حذف اطلاعات", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting about data:", error);
      setMessage({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت صفحه درباره ما
        </h1>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          🗑️ حذف همه اطلاعات
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            توضیحات
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="توضیحات درباره ما را وارد کنید..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            داستان ما
          </label>
          <textarea
            name="story"
            value={data.story}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="داستان ما را وارد کنید..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ماموریت
          </label>
          <textarea
            name="mission"
            value={data.mission}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="ماموریت ما را وارد کنید..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            چشم‌انداز
          </label>
          <textarea
            name="vision"
            value={data.vision}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="چشم‌انداز ما را وارد کنید..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            محتوای اضافی (اختیاری)
          </label>
          <textarea
            name="additionalContent"
            value={data.additionalContent}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="محتوای اضافی را وارد کنید..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ذخیره...
              </div>
            ) : (
              "💾 ذخیره اطلاعات"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}