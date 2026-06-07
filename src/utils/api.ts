import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function zodError(error: ZodError) {
  return apiError(error.issues[0]?.message || "Validation error");
}
