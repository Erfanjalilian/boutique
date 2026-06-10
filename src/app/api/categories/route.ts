import { getCategories } from "@/lib/repositories";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getCategories();
  // Return just the array, not wrapped in an object
  return NextResponse.json(categories);
}