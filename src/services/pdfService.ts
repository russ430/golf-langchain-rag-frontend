import axios from "axios";
import { UploadedFile, UploadResponse } from "../types/pdf";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post<UploadResponse>(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Upload response:", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || "Upload failed",
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

export const getUploadStatus = async (
  fileId: string
): Promise<UploadedFile> => {
  const response = await axios.get<UploadedFile>(
    `${API_BASE_URL}/status/${fileId}`
  );
  return response.data;
};
