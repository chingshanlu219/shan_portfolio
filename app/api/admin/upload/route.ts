import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/auth";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const maxSize = 10485760; // 10MB
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    const isAllowed =
      allowedTypes.includes(file.type) ||
      /\.(pdf|png|jpg|jpeg)$/i.test(file.name);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "僅支援 .pdf, .png, .jpg, .jpeg 格式" },
        { status: 400 }
      );
    }
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `檔案過大，最大 10MB。圖片會自動壓縮，PDF 請先壓縮後再上傳。`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const resourceType = file.type === "application/pdf" ? "raw" : "auto";

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string; public_id: string });
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error)?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
