export function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith(".pdf") || url.includes("/raw/");
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
