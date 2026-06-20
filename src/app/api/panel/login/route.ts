import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// مسیر فایل JSON اطلاعات ادمین
const ADMIN_DATA_PATH = path.join(process.cwd(), "data", "admin.json");

// تابع برای خواندن اطلاعات ادمین
const getAdminData = () => {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(ADMIN_DATA_PATH)) {
      // اطلاعات پیش‌فرض با نام کاربری و رمز عبور جدید
      const defaultAdmin = {
        username: "javaherkadearimehr",
        password: "۱۳۸۳",
        name: "مدیر سایت",
        email: "admin@javaherkade.com",
        createdAt: new Date().toISOString()
      };
      fs.writeFileSync(ADMIN_DATA_PATH, JSON.stringify(defaultAdmin, null, 2));
      return defaultAdmin;
    }

    const data = fs.readFileSync(ADMIN_DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading admin data:", error);
    return null;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // اعتبارسنجی ورودی
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "نام کاربری و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // دریافت اطلاعات ادمین
    const adminData = getAdminData();
    
    if (!adminData) {
      return NextResponse.json(
        { success: false, message: "خطا در خواندن اطلاعات ادمین" },
        { status: 500 }
      );
    }

    // مقایسه نام کاربری و رمز عبور (حساس به حروف بزرگ و کوچک نیست)
    const usernameMatch = username.toLowerCase() === adminData.username.toLowerCase();
    const passwordMatch = password === adminData.password;

    if (usernameMatch && passwordMatch) {
      // ایجاد توکن ساده
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
      
      // تنظیم کوکی برای احراز هویت
      const response = NextResponse.json({
        success: true,
        message: "ورود موفق",
        token: token,
        admin: {
          name: adminData.name,
          username: adminData.username,
          email: adminData.email
        }
      });

      // تنظیم کوکی (برای استفاده در سمت سرور)
      response.cookies.set("panelToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 7 روز
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}