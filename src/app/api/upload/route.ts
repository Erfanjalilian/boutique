import { getSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { apiSuccess, apiError } from "@/utils/api";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return apiError("دسترسی غیرمجاز", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const prefix = (formData.get("prefix") as string) || "upload";

    if (!file) {
      return apiError("فایلی انتخاب نشده است");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/x-icon", "image/vnd.microsoft.icon"];
    if (!allowedTypes.includes(file.type)) {
      return apiError("فرمت فایل نامعتبر است. فقط تصویر مجاز است.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return apiError("حجم فایل بیش از حد مجاز است (حداکثر ۵ مگابایت).");
    }

    const path = await saveUploadedFile(file, prefix);
    return apiSuccess({ path });
  } catch {
    return apiError("آپلود ناموفق بود", 500);
  }
}
