"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => {
      setResendTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setStep("otp");
      setResendTimer(120); // start 2 minute countdown for resend
    } else {
      setError(data.error || "ارسال کد تأیید ناموفق بود");
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setResendTimer(120);
    } else {
      setError(data.error || "ارسال مجدد ناموفق بود");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(data.data.redirectTo);
      router.refresh();
    } else {
      setError(data.error || "کد تأیید نامعتبر است");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-background to-background" />
      <Card className="relative w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">خوش آمدید به بوتیک</h1>
          <p className="text-muted text-sm mt-2">
            {step === "phone"
              ? "شماره موبایل خود را وارد کنید"
              : "کد تأیید ارسال‌شده را وارد کنید"}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              ارسال کد تأیید
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-muted text-center">
              کد به شماره <span className="text-foreground">{phone}</span> ارسال شد
            </p>
            <Input
              label="کد تأیید"
              placeholder="۱۲۳۴۵۶"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              تأیید و ورود
            </Button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                {resendTimer > 0 ? `ارسال مجدد در ${resendTimer}s` : "ارسال مجدد کد"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setStep("phone"); setError(""); }}
              className="w-full text-sm text-muted hover:text-primary transition-colors"
            >
              تغییر شماره موبایل
            </button>
          </form>
        )}

        
      </Card>
    </div>
  );
}

// Countdown timer effect
// (Placed after component to keep patch minimal; depends on resendTimer state)
