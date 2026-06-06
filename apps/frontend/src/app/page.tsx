"use client";

import { useState, useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";

// ==========================================
// SVG Custom Premium Icons (Inline)
// ==========================================
function BotIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );
}

function UserIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function DatabaseIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}

function ServerIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function UploadIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function TrashIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function SendIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function FileTextIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function RefreshIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6H16" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ==========================================
// Types
// ==========================================
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  sources?: Array<{ text: string; source: string }>;
}

interface DocFile {
  name: string;
  size?: number;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to AetherRAG, your private intelligence assistant. Ask questions directly derived from your locally indexed documents. No information leaves this environment.",
      timestamp: new Date(),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<DocFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  // Health & Server Status States
  const [servicesStatus, setServicesStatus] = useState({
    backend: "loading", // loading, online, offline
    ollama: "loading",
    chroma: "loading",
  });
  
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isResponding]);

  // Initial check and document fetch
  useEffect(() => {
    checkHealth();
    fetchDocuments();
    // Poll health status every 15 seconds
    const interval = setInterval(() => {
      checkHealth();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Check backend and downstream services status
  const checkHealth = async () => {
    try {
      const res = await fetch("http://localhost:8000/health", { mode: "cors" });
      if (res.ok) {
        const data = await res.json();
        setServicesStatus({
          backend: "online",
          ollama: data.ollama_status === "online" ? "online" : "offline",
          chroma: data.chroma_status === "online" ? "online" : "offline",
        });
      } else {
        // Fallback for root endpoint if /health is not fully implemented yet
        const rootRes = await fetch("http://localhost:8000/", { mode: "cors" });
        if (rootRes.ok) {
          setServicesStatus({
            backend: "online",
            ollama: "online",
            chroma: "online",
          });
        }
      }
    } catch (err) {
      setServicesStatus({
        backend: "offline",
        ollama: "offline",
        chroma: "offline",
      });
    }
  };

  // Fetch list of ingested documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:8000/documents", { mode: "cors" });
      if (res.ok) {
        const data = await res.json();
        setUploadedFiles(data.map((name: string) => ({ name })));
      }
    } catch (err) {
      console.error("Failed to load documents list", err);
    }
  };

  // Clear Vector DB
  const clearDatabase = async () => {
    if (!confirm("Are you sure you want to clear all index documents? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/clear", {
        method: "POST",
        mode: "cors",
      });
      if (res.ok) {
        triggerToast("success", "Vector store cleared successfully!");
        setUploadedFiles([]);
      } else {
        triggerToast("error", "Failed to clear vector store.");
      }
    } catch (err) {
      triggerToast("error", "Error contacting server to clear database.");
    }
  };

  // Submit Question to RAG
  const handleAskQuestion = async (questionText = inputQuestion) => {
    if (!questionText.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: questionText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsResponding(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ question: questionText }),
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: data.answer,
          sources: data.sources || [],
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      triggerToast("error", `RAG Query failed: ${err.message || err}`);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: "⚠️ I encountered an error attempting to process your question. Please ensure that the FastAPI backend (port 8000) and Ollama (port 11434) are active, and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  // Drag and Drop Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
      triggerToast("error", "Only PDF and TXT documents are supported.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        mode: "cors",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      triggerToast("success", `"${file.name}" ingested successfully!`);
      setUploadStatus("Document fully parsed and indexed!");
      
      // Update files list
      fetchDocuments();
    } catch (err: any) {
      triggerToast("error", `Indexing failed: ${err.message || err}`);
      setUploadStatus("Ingestion error.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const exampleQuestions = [
    "What are the employee leave benefits?",
    "Summarize the core guidelines in the handbook.",
    "What is the remote work policy?",
  ];

  return (
    <div className="flex h-full bg-[#07080e] text-[#e0e3ed] font-sans antialiased overflow-hidden">
      
      {/* ==========================================
          TOAST NOTIFICATION
         ========================================== */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 animate-slide-in ${
          toast.type === "success" 
            ? "bg-[#0b1b17] border-[#10b981]/30 text-[#10b981]" 
            : toast.type === "error" 
            ? "bg-[#270c0c] border-[#ef4444]/30 text-[#ef4444]" 
            : "bg-[#0f172a] border-[#3b82f6]/30 text-[#3b82f6]"
        }`}>
          {toast.type === "success" && <CheckIcon className="w-5 h-5 shrink-0 animate-scale-up" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ==========================================
          LEFT SIDE PANEL (DOCUMENT MANAGER)
         ========================================== */}
      <aside className="w-80 shrink-0 border-r border-[#1a1e2f] bg-[#0c0e1a]/85 backdrop-blur-md flex flex-col justify-between">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#1a1e2f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Æ
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                AETHER <span className="text-xs bg-[#1a1e2f] px-1.5 py-0.5 rounded text-[#8b5cf6] font-mono">RAG</span>
              </h1>
              <p className="text-[11px] text-[#717a94] font-medium uppercase tracking-wider">Fully Local AI Sandbox</p>
            </div>
          </div>
        </div>

        {/* Sidebar Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          
          {/* Health Status Widget */}
          <div className="space-y-3 bg-[#111425]/70 border border-[#1d2238] rounded-xl p-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#717a94] flex items-center justify-between">
              Services Network
              <button 
                onClick={checkHealth}
                className="hover:text-white p-0.5 rounded text-[#4b526d] transition-colors"
                title="Refresh Status"
              >
                <RefreshIcon className="w-3.5 h-3.5" />
              </button>
            </h2>

            <div className="space-y-2.5 pt-1">
              {/* FastAPI */}
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#a0acc0] flex items-center gap-2">
                  <ServerIcon className="w-4 h-4 text-[#6366f1]" />
                  FastAPI Server
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                  servicesStatus.backend === "online" 
                    ? "bg-[#10b981]/10 text-[#10b981]" 
                    : servicesStatus.backend === "offline" 
                    ? "bg-[#ef4444]/10 text-[#ef4444]" 
                    : "bg-[#eab308]/10 text-[#eab308]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    servicesStatus.backend === "online" 
                      ? "bg-[#10b981] animate-pulse" 
                      : servicesStatus.backend === "offline" 
                      ? "bg-[#ef4444]" 
                      : "bg-[#eab308]"
                  }`} />
                  {servicesStatus.backend}
                </span>
              </div>

              {/* Ollama */}
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#a0acc0] flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-[#8b5cf6]" />
                  Ollama (LLM)
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                  servicesStatus.ollama === "online" 
                    ? "bg-[#10b981]/10 text-[#10b981]" 
                    : servicesStatus.ollama === "offline" 
                    ? "bg-[#ef4444]/10 text-[#ef4444]" 
                    : "bg-[#eab308]/10 text-[#eab308]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    servicesStatus.ollama === "online" 
                      ? "bg-[#10b981] animate-pulse" 
                      : servicesStatus.ollama === "offline" 
                      ? "bg-[#ef4444]" 
                      : "bg-[#eab308]"
                  }`} />
                  {servicesStatus.ollama}
                </span>
              </div>

              {/* ChromaDB */}
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#a0acc0] flex items-center gap-2">
                  <DatabaseIcon className="w-4 h-4 text-[#3b82f6]" />
                  ChromaDB
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                  servicesStatus.chroma === "online" 
                    ? "bg-[#10b981]/10 text-[#10b981]" 
                    : servicesStatus.chroma === "offline" 
                    ? "bg-[#ef4444]/10 text-[#ef4444]" 
                    : "bg-[#eab308]/10 text-[#eab308]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    servicesStatus.chroma === "online" 
                      ? "bg-[#10b981] animate-pulse" 
                      : servicesStatus.chroma === "offline" 
                      ? "bg-[#ef4444]" 
                      : "bg-[#eab308]"
                  }`} />
                  {servicesStatus.chroma}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Documents Zone */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#717a94]">Ingest Document</h2>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-[#232a45] hover:border-[#6366f1]/60 bg-[#111425]/45 hover:bg-[#111425]/90 rounded-xl p-5 text-center cursor-pointer transition-all ${
                isUploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt"
                className="hidden"
              />
              <UploadIcon className="w-8 h-8 mx-auto text-[#4b5563] group-hover:text-white mb-2.5 transition-colors" />
              <p className="text-xs font-bold text-[#a0acc0]">Drag file here or browse</p>
              <p className="text-[10px] text-[#4b526d] mt-1">PDF, TXT (Max 50MB)</p>
            </div>
            {uploadStatus && (
              <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1.5 rounded-md bg-[#1d1f30] text-[11px] text-[#8b5cf6] font-semibold border border-[#8b5cf6]/20">
                <span className="w-2.5 h-2.5 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                {uploadStatus}
              </div>
            )}
          </div>

          {/* Ingested Documents List */}
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-wider uppercase text-[#717a94]">
                Knowledge Files ({uploadedFiles.length})
              </h2>
              {uploadedFiles.length > 0 && (
                <button
                  onClick={clearDatabase}
                  className="text-[#ef4444] hover:text-[#f87171] hover:bg-[#ef4444]/10 p-1.5 rounded-lg text-xs font-medium transition-colors"
                  title="Clear Knowledge Base"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 min-h-[120px] max-h-[300px] border border-[#1a1e2f] rounded-xl p-3 bg-[#090b14]/50 scrollbar-thin">
              {uploadedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-3 text-[#4b526d]">
                  <FileTextIcon className="w-8 h-8 opacity-25 mb-1.5" />
                  <p className="text-[11px] leading-relaxed">No local documents ingested yet.</p>
                </div>
              ) : (
                uploadedFiles.map((file, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-2 rounded-lg bg-[#111425]/60 hover:bg-[#111425] border border-[#1d2238] transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileTextIcon className="w-4 h-4 text-[#8b5cf6] shrink-0" />
                      <span 
                        className="text-xs font-medium text-[#e0e3ed] truncate hover:text-[#6366f1] cursor-pointer"
                        onClick={() => window.open(`http://localhost:3001/docs/${file.name}`, "_blank")}
                        title="Click to view file"
                      >
                        {file.name}
                      </span>
                    </div>
                    <button 
                      onClick={() => window.open(`http://localhost:3001/docs/${file.name}`, "_blank")}
                      className="opacity-0 group-hover:opacity-100 text-[#4b526d] hover:text-white p-1 rounded transition-opacity"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1a1e2f] bg-[#090b14]/80 flex items-center justify-between text-[11px] text-[#555d78] font-medium font-mono">
          <span>PORT 8000</span>
          <span>SECURE SECRETS</span>
        </div>

      </aside>

      {/* ==========================================
          RIGHT MAIN AREA (CHAT INTERFACE)
         ========================================== */}
      <main className="flex-1 flex flex-col bg-[#080911] relative">
        
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[45%] rounded-full bg-[#8b5cf6]/5 blur-[120px] pointer-events-none" />

        {/* Chat Area Header */}
        <header className="h-16 shrink-0 border-b border-[#141829] flex items-center justify-between px-6 z-10 bg-[#080911]/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <h2 className="text-sm font-bold text-white tracking-wide">Secure Vector Query Space</h2>
          </div>
          <div className="text-[11px] bg-[#141828] border border-[#232945] px-2.5 py-1 rounded-md text-[#8b5cf6] font-mono font-bold uppercase tracking-wider">
            Model: Qwen 3 8B
          </div>
        </header>

        {/* Message Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-8 space-y-6 z-10 scrollbar-thin"
        >
          
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              
              {/* Bot Avatar */}
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.15)] shrink-0">
                  <BotIcon className="w-4.5 h-4.5" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div className="max-w-[75%] space-y-2">
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed border shadow-md transition-all ${
                  msg.sender === "user"
                    ? "bg-[#6366f1] border-[#8183f4]/35 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(99,102,241,0.15)]"
                    : "bg-[#111425]/85 border-[#1d2238] text-[#d2d6e4] rounded-tl-sm"
                }`}>
                  {msg.sender === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-[#d2d6e4] prose-headings:text-white prose-a:text-[#8b5cf6] prose-strong:text-white prose-code:text-[#8b5cf6] prose-pre:bg-[#0c0e1a] prose-pre:border prose-pre:border-[#1d2238]">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Sources Card Layout */}
                {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                  <div className="pt-1.5 space-y-1.5">
                    <p className="text-[11px] font-bold text-[#717a94] uppercase tracking-wider flex items-center gap-1.5">
                      <ExternalLinkIcon className="w-3.5 h-3.5" /> Verified Citations
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, index) => (
                        <div 
                          key={index} 
                          className="p-2.5 rounded-lg bg-[#0c0e1a]/80 border border-[#1b2036] hover:border-[#6366f1]/45 transition-colors cursor-pointer"
                          onClick={() => window.open(`http://localhost:3001/docs/${src.source}`, "_blank")}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8b5cf6] mb-1">
                            <FileTextIcon className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[150px]">{src.source}</span>
                          </div>
                          <p className="text-[10px] text-[#717a94] line-clamp-2 italic leading-relaxed">
                            "{src.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] shrink-0">
                  <UserIcon className="w-4.5 h-4.5" />
                </div>
              )}

            </div>
          ))}

          {/* Assistant responds placeholder */}
          {isResponding && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6] shrink-0 animate-pulse">
                <BotIcon className="w-4.5 h-4.5" />
              </div>
              <div className="max-w-[70%] space-y-2">
                <div className="rounded-2xl px-4 py-3 bg-[#111425]/45 border border-[#1d2238]/60 rounded-tl-sm flex items-center gap-2 text-xs font-semibold text-[#8b5cf6]">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  Aether engine is querying ChromaDB & prompting LLM...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Example Prompt Options */}
        {messages.length === 1 && !isResponding && (
          <div className="px-8 pb-3 max-w-2xl mx-auto w-full z-10 space-y-2">
            <p className="text-[11px] font-bold text-[#4b526d] uppercase tracking-wider text-center mb-1">
              Sample queries to start
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {exampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  className="p-3 text-left rounded-xl bg-[#111425]/50 hover:bg-[#111425] border border-[#1d2238] hover:border-[#6366f1]/40 text-xs font-medium text-[#a0acc0] hover:text-white transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar Space */}
        <div className="p-6 border-t border-[#141829] z-10 bg-[#080911]/90 backdrop-blur-md">
          <div className="max-w-3xl mx-auto relative flex items-center">
            
            <textarea
              rows={1}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion();
                }
              }}
              placeholder={
                uploadedFiles.length === 0 
                  ? "⚠️ Ingest documents in the sidebar first, then query..." 
                  : "Ask anything about your ingested local documents..."
              }
              className="w-full bg-[#111425]/85 border border-[#232a45] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] rounded-2xl pl-4 pr-14 py-3 text-sm text-[#e0e3ed] placeholder-[#4b526d] focus:outline-none resize-none scrollbar-none transition-all pr-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
            />

            <button
              onClick={() => handleAskQuestion()}
              disabled={isResponding || !inputQuestion.trim()}
              className="absolute right-2 px-3 py-2 rounded-xl bg-[#6366f1] hover:bg-[#5254e0] disabled:bg-[#111425] disabled:border-[#1d2238] disabled:text-[#4b526d] disabled:cursor-not-allowed text-white shadow-md transition-all flex items-center justify-center border border-[#8183f4]/20"
            >
              <SendIcon className="w-4.5 h-4.5" />
            </button>

          </div>
          
          <p className="text-[10px] text-[#4b526d] text-center mt-2.5 font-medium font-sans">
            Fully Sandboxed • Ollama Local Node • No Cloud Requests Made
          </p>
        </div>

      </main>

    </div>
  );
}
