import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-primary/30 to-purple-600/20 border border-primary/20">
        <div className="absolute inset-0 bg-[url('/Image/placeholder-product.svg')] bg-cover bg-center opacity-10" />
        <div className="relative px-8 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            حراج تابستانه — تا ۳۰٪ تخفیف
          </h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            پیشنهاد محدود روی محصولات منتخب. کمد لباس خود را با قیمت‌های استثنایی به‌روز کنید.
          </p>
          <Link
            href="/products?sort=price-asc"
            className="inline-flex px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-medium transition-colors"
          >
            مشاهده حراج
          </Link>
        </div>
      </div>
    </section>
  );
}
