import ChatBox from "@/components/ChatBox";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function PaperChatPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      {/* Background color and full screen height */}
      <main className="min-h-screen bg-slate-50/50 flex flex-col">
        
        {/* Top Header / Navigation Area */}
        <div className="w-full max-w-5xl mx-auto px-4 pt-6 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="space-y-1">
              {/* Back to Library Link */}
              <Link 
                href="/library" 
                className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to Library
              </Link>
              
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Chat with Paper
              </h1>
            </div>

            {/* Document Info Badge */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">
                Document ID: <span className="font-mono text-slate-900">{params.id}</span>
              </span>
            </div>
            
          </div>
        </div>

        {/* Main Workspace Container */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-6">
          {/* 
            Chat Container: 
            Height set to calc(100vh - 180px) to keep it within view.
            Shadow and rounded corners for the "Card" look.
          */}
          <div className="bg-white h-[calc(100vh-180px)] min-h-[500px] rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <ChatBox paperId={params.id} />
          </div>
        </div>

      </main>
    </ProtectedRoute>
  );
}