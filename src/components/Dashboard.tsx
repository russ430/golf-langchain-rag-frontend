import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "./Sidebar";
import { PDFUploader } from "./PDFUploader";
import { UploadedFile } from "../types/pdf";

export const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // 1. Fetch files from SQLite on load
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/files");
      setFiles(response.data);
    } catch (err) {
      console.error("Failed to fetch library", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    // Poll every 5 seconds to catch status updates from the background task
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this research and its vectors?")) {
      await axios.delete(`http://localhost:8000/files/${id}`);
      fetchFiles();
    }
  };

  const stats = {
    total: files.length,
    completed: files.filter((f) => f.status === "completed").length,
    processing: files.filter((f) => f.status === "processing").length,
    errors: files.filter((f) => f.status === "error").length,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* LEFT NAV MENU */}
      <Sidebar files={files} onDelete={handleDelete} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Apriel Golf Lab
          </h1>
          <p className="text-sm text-gray-500">
            ServiceNow AI x Biomechanics Research
          </p>
        </header>

        <main className="p-8 max-w-5xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Library" value={stats.total} color="gray" />
            <StatCard
              label="Vectorized"
              value={stats.completed}
              color="green"
            />
            <StatCard label="Ingesting" value={stats.processing} color="blue" />
            <StatCard label="Issues" value={stats.errors} color="red" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Ingest New Research</h2>
            <PDFUploader onFilesChange={fetchFiles} files={files} />
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
  const colorMap: any = {
    green: "text-green-600",
    blue: "text-blue-600",
    red: "text-red-600",
    gray: "text-gray-900",
  };
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </h3>
      <p className={`text-2xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
    </div>
  );
};
