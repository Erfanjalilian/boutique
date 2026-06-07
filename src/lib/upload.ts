import { promises as fs } from "fs";
import path from "path";

const IMAGE_DIR = path.join(process.cwd(), "public", "Image");

export async function saveUploadedFile(
  file: File,
  prefix = "upload"
): Promise<string> {
  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${prefix}-${Date.now()}${ext}`;
  const filePath = path.join(IMAGE_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/Image/${filename}`;
}

export async function deleteUploadedFile(imagePath: string): Promise<void> {
  if (!imagePath.startsWith("/Image/")) return;
  const filePath = path.join(process.cwd(), "public", imagePath);
  try {
    await fs.unlink(filePath);
  } catch {
    // file may not exist
  }
}
