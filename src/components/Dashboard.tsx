import React, { useState } from "react";
import { PDFUploader } from "./PDFUploader";
import { UploadedFile } from "../types/pdf";

export const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  };

  const getStats = () => {
    const total = files.length;
    const completed = files.filter((f) => f.status === "completed").length;
    const processing = files.filter(
      (f) => f.status === "processing" || f.status === "uploading"
    ).length;
    const errors = files.filter((f) => f.status === "error").length;

    return { total, completed, processing, errors };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                PDF Management Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload and manage PDF documents for embedding and vectorization
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Files</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Processing</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.processing}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Errors</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {stats.errors}
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Upload PDFs</h2>
          </div>
          <PDFUploader onFilesChange={handleFilesChange} files={files} />
        </div>
      </main>
    </div>
  );
};
