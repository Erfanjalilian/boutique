import Link from "next/link";

interface FooterProps {
  websiteName?: string;
  footerText?: string;
  footerLinks?: { label: string; href: string }[];
}

export function Footer({
  footerLinks = [],
}: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معرفی سایت */}
          <div>
            <h3 className="text-lg font-bold mb-3">ساعتکده آریامهر</h3>
            <p className="text-sm text-muted leading-relaxed">
              اصالت و شرافت دنیای مجازی و حقیقی ندارد، اصیل و شریف باشیم.
            </p>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted">
              لینک‌های سریع
            </h4>

            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* پشتیبانی + اینماد */}
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted">
              پشتیبانی مشتریان
            </h4>

            <ul className="space-y-2 text-sm text-muted mb-6">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  تماس با ما
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/orders"
                  className="hover:text-primary transition-colors"
                >
                  پیگیری سفارش
                </Link>
              </li>
            </ul>

            {/* لوگوی اینماد */}
            <div className="flex justify-center md:justify-start">
              <a
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://trustseal.enamad.ir/?id=752950&Code=YBnJwgb2TeENs91eKvlEUoTMFvI9z2O7"
                className="inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=752950&Code=YBnJwgb2TeENs91eKvlEUoTMFvI9z2O7"
                  alt="نماد اعتماد الکترونیکی"
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* بخش پایین فوتر */}
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted">
          <div>طراحی شده توسط عرفان جلیلیان</div>

          <div className="flex items-center gap-4">
            <Link
              href="/panel/login"
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

              ورود ادمین
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}