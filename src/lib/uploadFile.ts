import { api } from "./axios";

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fileKey: string;
}

/**
 * Uploads a file directly to Cloudflare R2 (or any S3-compatible storage) using a presigned URL.
 * Bypasses the Node.js API to save memory and bandwidth.
 * 
 * @param file The File object from an <input type="file" /> or Drag-and-Drop
 * @returns The final public URL of the uploaded file
 */
export async function uploadFile(file: File): Promise<string> {
  // 1. Get the Presigned URL from our API
  const { data } = await api.post<{ data: PresignedUrlResponse }>("/upload/presigned-url", {
    fileName: file.name,
    contentType: file.type,
  });

  const { uploadUrl, publicUrl } = data.data;

  // 2. Upload the file directly to the Cloud (R2)
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file to storage: ${uploadResponse.statusText}`);
  }

  // 3. Return the final URL so it can be saved in the database (e.g. as a Question image)
  return publicUrl;
}
