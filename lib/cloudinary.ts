export function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith(".pdf") || url.includes("/raw/");
}

/**
 * Get first-page preview image URL for Cloudinary PDFs (uploaded as image type).
 * Returns null for raw PDFs (no preview available).
 */
export function getPdfPreviewUrl(
  url: string | null | undefined,
  options?: { width?: number; height?: number; crop?: string }
): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;
  if (url.includes("/raw/")) return null;
  if (!url.toLowerCase().includes(".pdf")) return null;
  const uploadIdx = url.indexOf("/upload/");
  if (uploadIdx === -1) return null;
  const before = url.substring(0, uploadIdx + 8);
  const after = url.substring(uploadIdx + 8);
  const transforms: string[] = [];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (transforms.length === 0) transforms.push("w_800", "c_fill");
  const newPath = after.replace(/\.pdf$/i, ".jpg");
  return `${before}${transforms.join(",")}/${newPath}`;
}

export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  }
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (options) {
    const transformations: string[] = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (transformations.length > 0) {
      url += `/${transformations.join(",")}`;
    }
  }
  url += `/${publicId}`;
  return url;
}

export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/.*\/([^/]+)\.(jpg|jpeg|png|gif|webp|heic)/i);
  return match ? match[1] : null;
}

export function convertCloudinaryUrlToWebFormat(url: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  if (url.includes(".heic") || url.match(/\/heic/i)) {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    const beforeUpload = url.substring(0, uploadIndex + 8);
    const afterUpload = url.substring(uploadIndex + 8);
    const versionMatch = afterUpload.match(/^(v\d+)\//);
    if (versionMatch) {
      const rest = afterUpload.substring(versionMatch[1].length + 1);
      const newPath = rest.replace(/\.heic$/i, ".jpg");
      return `${beforeUpload}f_jpg/${versionMatch[1]}/${newPath}`;
    }
    const newPath = afterUpload.replace(/\.heic$/i, ".jpg");
    return `${beforeUpload}f_jpg/${newPath}`;
  }
  return url;
}
