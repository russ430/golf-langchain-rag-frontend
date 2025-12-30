export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: "uploading" | "processing" | "completed" | "error";
  errorMessage?: string;
  preview?: string;
}

export interface UploadResponse {
  success: boolean;
  fileId?: string;
  message?: string;
  error?: string;
}
