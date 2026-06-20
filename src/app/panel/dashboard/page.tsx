import Link from "next/link";

export default function DashboardPage() {
  // اطلاعات آماری (موقت - بعداً از API دریافت می‌شود)
  const stats = [
    { label: "تعداد کاربران", value: "۱۵۶", icon: "👥", color: "bg-blue-500" },
    { label: "تعداد سفارشات", value: "۴۲", icon: "📦", color: "bg-green-500" },
    { label: "تعداد محصولات", value: "۸۹", icon: "🛍️", color: "bg-purple-500" },
    { label: "پیام‌های جدید", value: "۱۲", icon: "💬", color: "bg-yellow-500" },
  ];

  return (
    <div>
      {/* هدر */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          📊 داشبورد مدیریت
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          به پنل مدیریت ساعتکده آریامهر خوش آمدید
        </p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* لینک‌های سریع - مدیریت صفحات */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🚀 مدیریت صفحات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <QuickLink
            href="/panel/dashboard/about"
            icon="ℹ️"
            title="مدیریت درباره ما"
            description="ویرایش اطلاعات صفحه درباره ما"
          />
          <QuickLink
            href="/panel/dashboard/contact"
            icon="📧"
            title="مدیریت تماس با ما"
            description="ویرایش اطلاعات صفحه تماس با ما"
          />
        </div>
      </div>

      {/* لینک‌های سریع - مدیریت کاربران و سفارشات */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          👥 مدیریت کاربران و سفارشات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <QuickLink
            href="/panel/dashboard/users"
            icon="👤"
            title="لیست کاربران"
            description="مشاهده و مدیریت کاربران"
          />
          <QuickLink
            href="/panel/dashboard/orders"
            icon="📋"
            title="مدیریت سفارشات"
            description="مشاهده و پیگیری سفارشات"
          />
        </div>
      </div>

      {/* لینک‌های سریع - مدیریت محصولات */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🛍️ مدیریت محصولات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <QuickLink
            href="/panel/dashboard/products"
            icon="🛍️"
            title="مدیریت محصولات"
            description="افزودن، ویرایش و حذف محصولات"
          />
        </div>
      </div>
    </div>
  );
}

// کامپوننت لینک سریع
function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] group"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}