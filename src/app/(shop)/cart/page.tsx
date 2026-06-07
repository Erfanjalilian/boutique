"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/utils/helpers";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="سبد خرید شما خالی است"
        description="محصولات مورد علاقه خود را به سبد اضافه کنید."
        action={
          <Link href="/products">
            <Button>شروع خرید</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.productId}-${item.size}-${item.color}`} className="p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-background">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-muted mt-1">
                    {item.size} · {item.color}
                  </p>
                  <p className="text-primary font-semibold mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-muted hover:text-red-400 text-sm"
                  >
                    حذف
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">خلاصه سفارش</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted">
              <span>جمع جزء</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>هزینه ارسال</span>
              <span>رایگان</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
              <span>مجموع</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block mt-6">
            <Button className="w-full" size="lg">
              ادامه و تسویه حساب
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
