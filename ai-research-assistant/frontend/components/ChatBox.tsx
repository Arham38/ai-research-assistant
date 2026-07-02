"use client";

import { useState, useRef, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { getChatHistory } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ChatBox({ paperId }: { paperId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getChatHistory(paperId)
      .then((data) => {
        if (!cancelled) setMessages(data as Message[]);
      })
      .catch(() => {
        // no history yet, or failed to load — start fresh, not fatal
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [paperId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || streaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/chat/${paperId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok || !res.body) throw new Error(`Chat request failed: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const data = part.slice(6);
          if (data === "[DONE]") continue;

          try {
            const { token } = JSON.parse(data);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: updated[updated.length - 1].content + token,
              };
              return updated;
            });
          } catch {
            // skip malformed SSE chunk
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Something went wrong. Please try again." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30">
        
        {/* Loading History State */}
        {loadingHistory && (
          <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-70">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Loading conversation...</p>
          </div>
        )}

        {/* Empty State */}
        {!loadingHistory && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="9" y1="10" x2="15" y2="10"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-slate-800">Ask about this paper</p>
              <p className="text-sm text-slate-500 mt-1">Answers will be generated strictly from its content.</p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((m, i) => (
          <div key={i} className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.role === "user"
                  ? "bg-slate-900 text-white rounded-2xl rounded-br-sm"
                  : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm"
              }`}
            >
              {m.role === "assistant" && (
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a2 2 0 0 1 2 2c-.11.83.1 1.63.58 2.31A4 4 0 0 0 18 10a4 4 0 0 0-3.42 3.69c-.48.68-.69 1.48-.58 2.31a2 2 0 0 1-4 0c.11-.83-.1-1.63-.58-2.31A4 4 0 0 0 6 10a4 4 0 0 0 3.42-3.69c.48-.68.69-1.48.58-2.31a2 2 0 0 1 2-2z"></path>
                  </svg>
                  AI Assistant
                </div>
              )}
              {m.content || (streaming && i === messages.length - 1 ? <span className="animate-pulse text-slate-400">● ● ●</span> : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center max-w-4xl mx-auto bg-slate-50 border border-slate-300 focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-500/10 rounded-2xl overflow-hidden transition-all duration-200 p-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question about this paper..."
            className="flex-1 bg-transparent px-3 py-2.5 text-[15px] outline-none text-slate-800 placeholder:text-slate-400"
            disabled={streaming}
          />
          <button
            onClick={sendMessage}
            disabled={streaming || !input.trim()}
            className="flex items-center justify-center p-2.5 ml-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors group"
            aria-label="Send message"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`transition-transform duration-200 ${!streaming && input.trim() ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : ""}`}
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[11px] text-slate-400 font-medium">AI can make mistakes. Verify important information from the source text.</p>
        </div>
      </div>
    </div>
  );
}