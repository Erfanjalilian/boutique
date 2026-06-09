import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl animate-fade-in">
          <p className="text-primary font-medium mb-4 tracking-wide text-sm">
            کالکشن جدید ۱۴۰۴
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            سبک خود را
            <span className="text-primary"> ارتقا دهید</span>
          </h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            اصالت و شرافت دنیای مجازی و حقیقی ندارد ، اصیل و شریف باشیم .


          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg">خرید کنید</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary">
                بیشتر بدانید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
