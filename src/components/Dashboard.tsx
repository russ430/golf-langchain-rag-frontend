import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "./Sidebar";
import { PDFUploader } from "./PDFUploader";
import { UploadedFile } from "../types/pdf";
import { Loader2, Trash2, Search, Activity } from "lucide-react";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/files");
      setFiles(response.data);
      console.log("Fetched files:", response.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    // const interval = setInterval(fetchFiles, 5000);
    // return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete entry?")) {
      await axios.delete(`http://localhost:8000/files/${id}`);
      fetchFiles();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Main</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700 capitalize">
              {activeTab}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "dashboard" && (
              <DashboardView files={files} fetchFiles={fetchFiles} />
            )}
            {activeTab === "database" && (
              <DatabaseView files={files} handleDelete={handleDelete} />
            )}
            {activeTab === "analysis" && <AnalysisView />}
          </div>
        </main>
      </div>
    </div>
  );
};

// StatCard component for dashboard stats
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

// --- SUB-COMPONENTS FOR VIEWS ---

const DashboardView = ({
  files,
  fetchFiles,
}: {
  files: UploadedFile[];
  fetchFiles: () => void;
}) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-4 gap-6">
      <StatCard label="Total Papers" value={files.length} color="gray" />
      <StatCard
        label="Vectorized"
        value={files.filter((f) => f.status === "completed").length}
        color="green"
      />
      <StatCard
        label="In Progress"
        value={files.filter((f) => f.status === "processing").length}
        color="blue"
      />
      <StatCard
        label="Failed"
        value={files.filter((f) => f.status === "error").length}
        color="red"
      />
    </div>
    <div className="bg-white rounded-xl shadow-sm border p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Ingest Research Paper
      </h2>
      <PDFUploader onFilesChange={fetchFiles} files={files} />
    </div>
  </div>
);

const DatabaseView = ({
  files,
  handleDelete,
}: {
  files: UploadedFile[];
  handleDelete: (id: string) => void;
}) => (
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-6 border-b flex justify-between items-center bg-slate-50">
      <h2 className="text-xl font-bold text-slate-800">
        SQLite Metadata Registry
      </h2>
      <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">
        table: files
      </span>
    </div>
    <table className="w-full text-left border-collapse">
      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
        <tr>
          <th className="px-6 py-4">ID / Reference</th>
          <th className="px-6 py-4">Filename</th>
          <th className="px-6 py-4">Upload Date</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {files.map((file) => (
          <tr key={file.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
              {file.id}
            </td>
            <td className="px-6 py-4 font-medium text-slate-700">
              {file.name}
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
              {typeof file.uploadDate === "string"
                ? new Date(file.uploadDate).toLocaleDateString()
                : "N/A"}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  file.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : file.status === "processing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {file.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleDelete(file.id)}
                className="text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnalysisView = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // This hits your FastAPI /analyze endpoint
      const response = await axios.post("http://localhost:8000/analyze", {
        notes: query,
        incident_id: "TEST-INC-001",
      });
      setResult(response.data);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8 h-full animate-in fade-in duration-500">
      {/* LEFT: Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="text-blue-500" size={20} />
            Swing Fault Description
          </h2>
          <textarea
            className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
            placeholder="Describe the student's fault (e.g. 'Student is losing posture early in the downswing causing a block right')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !query}
            className="w-full mt-4 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Run Research-Backed Analysis"
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: AI Output & RAG Sources */}
      <div className="bg-slate-900 rounded-xl p-6 text-slate-300 shadow-xl overflow-y-auto border border-slate-700">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 italic">
            <Search size={48} className="mb-4 opacity-20" />
            <p>Awaiting analysis... Enter notes to the left.</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse" />
            <p className="text-xs text-blue-400 font-mono animate-pulse mt-8">
              [SYSTEM]: Querying ChromaDB for relevant biomechanics chunks...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                RAG ANALYSIS COMPLETE
              </span>
            </div>
            {/* We use whitespace-pre-wrap to respect the AI's formatting/bullet points */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {result.analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
