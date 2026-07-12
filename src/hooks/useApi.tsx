import { useEffect, useState, useCallback, useRef } from "react";

interface UseApiOptions {
  /** فاصله refetch خودکار (میلی‌ثانیه) - اگر نشود تنظیم کنید auto-refetch غیفعال است */
  revalidateInterval?: number;
  /** فوری refetch پس از mount */
  revalidateOnMount?: boolean;
  /** فیلد query string */
  params?: Record<string, any>;
}

interface UseApiReturn<T> {
  /** داده‌های فچ‌شده */
  data: T | null;
  /** درحال بارگذاری */
  loading: boolean;
  /** خطا */
  error: Error | null;
  /** دستی refetch کردن */
  refetch: () => Promise<void>;
  /** منطق برای مجدد سازی داده‌ها */
  mutate: (newData: T | null) => void;
}

/**
 * Custom hook برای data fetching با auto-revalidation
 * هر وقت `revalidateInterval` تنظیم شود، خودکار refetch می‌کند
 * پس از هر mutation (POST/PUT/DELETE) می‌توان `refetch()` یا `mutate()` فراخوانی کرد
 * 
 * @example
 * const { data, loading, refetch } = useApi<Product[]>("/api/products", { revalidateInterval: 5000 });
 */
export function useApi<T = any>(
  url: string,
  { revalidateInterval, revalidateOnMount = true, params }: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!revalidateOnMount);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // ایجاد full URL با params
  const buildUrl = useCallback(() => {
    const fullUrl = new URL(url, typeof window !== "undefined" ? window.location.origin : "");
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fullUrl.searchParams.append(key, String(value));
        }
      });
    }
    return fullUrl.toString();
  }, [url, params]);

  // تابع fetch کردن
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fullUrl = buildUrl();
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      
      // Handle response که یا `{data: T}` یا مستقیم `T` باشد
      setData(json.data !== undefined ? json.data : json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  // refetch بعد از mutations
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // تابع برای mutate کردن داده‌ها بدون fetch
  const mutate = useCallback((newData: T | null) => {
    setData(newData);
  }, []);

  // Initial fetch + auto-revalidation
  useEffect(() => {
    if (revalidateOnMount) {
      fetchData();
    }

    if (revalidateInterval && revalidateInterval > 0) {
      intervalRef.current = setInterval(fetchData, revalidateInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, revalidateInterval, revalidateOnMount]);

  return { data, loading, error, refetch, mutate };
}
