import React from "react";
import { UploadedFile } from "../types/pdf";
import {
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface SidebarProps {
  files: UploadedFile[];
  onDelete: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ files, onDelete }) => {
  return (
    <div className="w-80 bg-white border-r h-screen flex flex-col">
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Research Library</h2>
        <p className="text-xs text-gray-500 mt-1">
          Managed via SQLite & ChromaDB
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {files.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-10 italic">
            No papers uploaded yet.
          </p>
        )}
        {files.map((file) => (
          <div
            key={file.id}
            className="group flex items-center justify-between p-3 rounded-lg border bg-white hover:border-blue-300 transition-colors shadow-sm"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {file.status === "completed" && (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              )}
              {file.status === "processing" && (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              )}
              {file.status === "error" && (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}

              <div className="truncate">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">
                  {file.status}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDelete(file.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
