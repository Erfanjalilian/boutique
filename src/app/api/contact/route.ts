import { NextRequest, NextResponse } from "next/server";
import { getContact, saveContact } from "@/lib/repositories";

// ============== GET - دریافت اطلاعات تماس با ما ==============
export async function GET() {
  try {
    const contact = await getContact();
    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    console.error("Error in GET /api/contact:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در دریافت اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== POST - ایجاد اطلاعات جدید تماس با ما ==============
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, address, socialMedia } = body;

    // اعتبارسنجی
    if (!phone || !email || !address) {
      return NextResponse.json(
        { 
          success: false, 
          message: "فیلدهای phone, email و address الزامی هستند" 
        },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا اطلاعات قبلی وجود دارد
    const existingContact = await getContact();
    if (existingContact.phone || existingContact.email) {
      return NextResponse.json(
        { 
          success: false, 
          message: "اطلاعات تماس قبلاً ایجاد شده است. برای ویرایش از PUT استفاده کنید." 
        },
        { status: 409 }
      );
    }

    const newContact = {
      phone,
      email,
      address,
      socialMedia: socialMedia || {}
    };

    await saveContact(newContact);

    return NextResponse.json({
      success: true,
      message: "اطلاعات تماس با موفقیت ایجاد شد",
      data: newContact
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در ایجاد اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== PUT - به‌روزرسانی کامل اطلاعات تماس با ما ==============
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, address, socialMedia } = body;

    // اعتبارسنجی
    if (!phone || !email || !address) {
      return NextResponse.json(
        { 
          success: false, 
          message: "فیلدهای phone, email و address الزامی هستند" 
        },
        { status: 400 }
      );
    }

    const updatedContact = {
      phone,
      email,
      address,
      socialMedia: socialMedia || {}
    };

    await saveContact(updatedContact);

    return NextResponse.json({
      success: true,
      message: "اطلاعات تماس با موفقیت به‌روزرسانی شد",
      data: updatedContact
    });
  } catch (error: any) {
    console.error("Error in PUT /api/contact:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در به‌روزرسانی اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== PATCH - به‌روزرسانی جزئی اطلاعات تماس ==============
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // دریافت اطلاعات فعلی
    const currentContact = await getContact();
    
    // ادغام اطلاعات جدید با اطلاعات فعلی
    const updatedContact = {
      phone: body.phone !== undefined ? body.phone : currentContact.phone,
      email: body.email !== undefined ? body.email : currentContact.email,
      address: body.address !== undefined ? body.address : currentContact.address,
      socialMedia: body.socialMedia !== undefined ? body.socialMedia : currentContact.socialMedia
    };

    await saveContact(updatedContact);

    return NextResponse.json({
      success: true,
      message: "اطلاعات تماس با موفقیت به‌روزرسانی شد",
      data: updatedContact
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/contact:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در به‌روزرسانی اطلاعات" 
      },
      { status: 500 }
    );
  }
}

// ============== DELETE - حذف/بازنشانی اطلاعات تماس ==============
export async function DELETE() {
  try {
    const defaultContact = {
      phone: "",
      email: "",
      address: "",
      socialMedia: {}
    };

    await saveContact(defaultContact);

    return NextResponse.json({
      success: true,
      message: "اطلاعات تماس با موفقیت حذف شد",
      data: defaultContact
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/contact:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "خطا در حذف اطلاعات" 
      },
      { status: 500 }
    );
  }
}