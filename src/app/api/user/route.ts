import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/repositories";

// ============== GET - دریافت لیست کاربران ==============
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    let users = await getUsers();

    // فیلتر بر اساس نقش
    if (role) {
      users = users.filter((u) => u.role === role);
    }

    // جستجو بر اساس نام یا شماره تلفن
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.phone.includes(search)
      );
    }

    // مرتب‌سازی بر اساس تاریخ ایجاد (جدیدترین اول)
    users = users.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "خطا در دریافت لیست کاربران",
      },
      { status: 500 }
    );
  }
}