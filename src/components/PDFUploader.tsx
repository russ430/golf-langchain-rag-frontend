import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { UploadedFile } from "../types/pdf";
import { uploadPDF } from "../services/pdfService";
import axios from "axios";

interface PDFUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({
  onFilesChange,
  files,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);

      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
        status: "uploading" as const,
      }));

      onFilesChange([...files, ...newFiles]);

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileRecord = newFiles[i];

        try {
          const response = await uploadPDF(file);

          if (response.success) {
            fileRecord.status = "processing";
            fileRecord.id = response.fileId || fileRecord.id;

            // Simulate processing completion (in real app, poll status endpoint)
            setTimeout(() => {
              fileRecord.status = "completed";
              onFilesChange([...files, ...newFiles]);
            }, 2000);
          } else {
            fileRecord.status = "error";
            fileRecord.errorMessage = response.error || "Upload failed";
          }
        } catch (error) {
          fileRecord.status = "error";
          fileRecord.errorMessage = "Upload failed";
        }
      }

      onFilesChange([...files, ...newFiles]);
      setIsUploading(false);
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    onFilesChange(files.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm("Are you sure you want to delete this research?")) {
      await axios.delete(`http://localhost:8000/files/${fileId}`);
      // Refresh your file list here
      // fetchFiles();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop the PDF files here...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Drag & drop PDF files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Only PDF files are supported
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} •{" "}
                      {/* Add this check to handle strings or missing dates */}
                      {file.uploadDate
                        ? typeof file.uploadDate === "string"
                          ? new Date(file.uploadDate).toLocaleString()
                          : file.uploadDate.toLocaleString()
                        : "No Date"}
                    </p>
                    {file.errorMessage && (
                      <p className="text-sm text-red-600 mt-1">
                        {file.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(file.status)}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
