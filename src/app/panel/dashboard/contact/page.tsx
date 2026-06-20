"use client";

import { useState, useEffect } from "react";

interface SocialMedia {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  telegram?: string;
  [key: string]: string | undefined;
}

interface ContactData {
  phone: string;
  email: string;
  address: string;
  socialMedia: SocialMedia;
}

export default function ContactManagementPage() {
  const [data, setData] = useState<ContactData>({
    phone: "",
    email: "",
    address: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
      telegram: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // بارگذاری اطلاعات
  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    setFetching(true);
    try {
      const response = await fetch("/api/contact");
      const result = await response.json();
      
      if (result.success && result.data) {
        setData({
          ...result.data,
          socialMedia: result.data.socialMedia || {}
        });
      }
    } catch (error) {
      console.error("Error loading contact data:", error);
      setMessage({ text: "خطا در بارگذاری اطلاعات", type: "error" });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // اگر فیلد مربوط به شبکه‌های اجتماعی است
    if (name.startsWith("social_")) {
      const socialKey = name.replace("social_", "");
      setData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialKey]: value
        }
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // بررسی اینکه آیا اطلاعات وجود دارد یا نه
      const checkResponse = await fetch("/api/contact");
      const checkResult = await checkResponse.json();
      
      let response;
      // اگر اطلاعات وجود دارد، از PUT استفاده کن
      if (checkResult.success && checkResult.data && 
          (checkResult.data.phone || checkResult.data.email)) {
        response = await fetch("/api/contact", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // اگر اطلاعات وجود ندارد، از POST استفاده کن
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        setMessage({ text: "✅ اطلاعات تماس با موفقیت ذخیره شد", type: "success" });
        setData(result.data);
      } else {
        setMessage({ text: result.message || "❌ خطا در ذخیره اطلاعات", type: "error" });
      }
    } catch (error) {
      console.error("Error saving contact data:", error);
      setMessage({ text: "❌ خطا در ارتباط با سرور", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("آیا از حذف تمام اطلاعات تماس مطمئن هستید؟")) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        setData({
          phone: "",
          email: "",
          address: "",
          socialMedia: {}
        });
        setMessage({ text: "✅ اطلاعات تماس با موفقیت حذف شد", type: "success" });
      } else {
        setMessage({ text: result.message || "❌ خطا در حذف اطلاعات", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting contact data:", error);
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
          مدیریت صفحه تماس با ما
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
        {/* شماره تلفن */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            شماره تلفن
          </label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="مثال: ۰۲۱-۱۲۳۴۵۶۷۸"
            required
          />
        </div>

        {/* ایمیل */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="مثال: info@example.com"
            required
          />
        </div>

        {/* آدرس */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            آدرس
          </label>
          <textarea
            name="address"
            value={data.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="آدرس کامل را وارد کنید..."
            required
          />
        </div>

        {/* شبکه‌های اجتماعی */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            شبکه‌های اجتماعی
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اینستاگرام
              </label>
              <input
                type="text"
                name="social_instagram"
                value={data.socialMedia.instagram || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                توییتر
              </label>
              <input
                type="text"
                name="social_twitter"
                value={data.socialMedia.twitter || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                فیسبوک
              </label>
              <input
                type="text"
                name="social_facebook"
                value={data.socialMedia.facebook || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تلگرام
              </label>
              <input
                type="text"
                name="social_telegram"
                value={data.socialMedia.telegram || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="https://t.me/..."
              />
            </div>
          </div>
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