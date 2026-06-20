import { NextRequest, NextResponse } from "next/server";
import { getAbout, saveAbout } from "@/lib/repositories";

// ============== GET - دریافت اطلاعات درباره ما ==============
export async function GET() {
  try {
    const about = await getAbout();
    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error: any) {
    console.error("Error in GET /api/about:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در دریافت اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== POST - ایجاد اطلاعات جدید درباره ما ==============
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, story, mission, vision, additionalContent } = body;

    // اعتبارسنجی
    if (!description || !story || !mission || !vision) {
      return NextResponse.json(
        { 
          success: false, 
          message: "فیلدهای description, story, mission و vision الزامی هستند" 
        },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا اطلاعات قبلی وجود دارد
    const existingAbout = await getAbout();
    if (existingAbout.description || existingAbout.story) {
      return NextResponse.json(
        { 
          success: false, 
          message: "اطلاعات درباره ما قبلاً ایجاد شده است. برای ویرایش از PUT استفاده کنید." 
        },
        { status: 409 }
      );
    }

    const newAbout = {
      description,
      story,
      mission,
      vision,
      additionalContent: additionalContent || ""
    };

    await saveAbout(newAbout);

    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت ایجاد شد",
      data: newAbout
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/about:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در ایجاد اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== PUT - به‌روزرسانی کامل اطلاعات درباره ما ==============
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, story, mission, vision, additionalContent } = body;

    // اعتبارسنجی
    if (!description || !story || !mission || !vision) {
      return NextResponse.json(
        { 
          success: false, 
          message: "فیلدهای description, story, mission و vision الزامی هستند" 
        },
        { status: 400 }
      );
    }

    const updatedAbout = {
      description,
      story,
      mission,
      vision,
      additionalContent: additionalContent || ""
    };

    await saveAbout(updatedAbout);

    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت به‌روزرسانی شد",
      data: updatedAbout
    });
  } catch (error: any) {
    console.error("Error in PUT /api/about:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در به‌روزرسانی اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== PATCH - به‌روزرسانی جزئی اطلاعات ==============
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // دریافت اطلاعات فعلی
    const currentAbout = await getAbout();
    
    // ادغام اطلاعات جدید با اطلاعات فعلی
    const updatedAbout = {
      description: body.description !== undefined ? body.description : currentAbout.description,
      story: body.story !== undefined ? body.story : currentAbout.story,
      mission: body.mission !== undefined ? body.mission : currentAbout.mission,
      vision: body.vision !== undefined ? body.vision : currentAbout.vision,
      additionalContent: body.additionalContent !== undefined ? body.additionalContent : currentAbout.additionalContent
    };

    await saveAbout(updatedAbout);

    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت به‌روزرسانی شد",
      data: updatedAbout
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/about:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در به‌روزرسانی اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== DELETE - حذف/بازنشانی اطلاعات درباره ما ==============
export async function DELETE() {
  try {
    const defaultAbout = {
      description: "",
      story: "",
      mission: "",
      vision: "",
      additionalContent: ""
    };

    await saveAbout(defaultAbout);

    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت حذف شد",
      data: defaultAbout
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/about:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در حذف اطلاعات" 
      },
      { status: 500 }
    );
  }
}