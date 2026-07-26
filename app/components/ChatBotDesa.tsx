"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import Icon from "./Icon";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ChatBotDesa() {
  const pathname = usePathname();
  const isAdminOrLogin = pathname.startsWith("/admin") || pathname === "/login";
  
  const [isOpen, setIsOpen] = useState(false);
  
  const [input, setInput] = useState("");
  const { messages, status, sendMessage, error } = useChat();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage({ 
      role: "user", 
      parts: [{ type: "text", text: input }] 
    });
    
    setInput("");
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, error]);

  if (isAdminOrLogin) return null;

  return (
    <motion.div 
      drag={!isOpen}
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-200 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-5 py-4 flex items-center justify-between text-white cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <Icon name="support_agent" className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Layanan Informasi</h3>
                  <p className="text-xs text-gray-400">Siap membantu Anda</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm my-auto px-4">
                  <Icon name="waving_hand" className="text-2xl md:text-4xl mb-3 text-gray-300" />
                  <p>Halo! Selamat datang di layanan informasi Desa Kedungdowo. Ada yang bisa saya bantu?</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col max-w-[85%] ${m.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <span className="text-[10px] text-gray-400 font-semibold mb-1 px-1">
                    {m.role === "user" ? "Anda" : "Layanan Informasi"}
                  </span>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user" 
                        ? "bg-gray-800 text-white rounded-tr-sm shadow-sm" 
                        : "bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-sm"
                    }`}
                  >
                    {/* Content is now always in parts array */}
                    {m.parts?.map((part, i) => (
                      <span key={i}>
                        {part.type === 'text' ? part.text : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="self-start flex gap-1 px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              )}
              {error && (
                <div className="flex flex-col max-w-[85%] self-start items-start">
                  <span className="text-[10px] text-red-500 font-semibold mb-1 px-1">
                    Sistem
                  </span>
                  <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed bg-red-50 text-red-700 rounded-tl-sm border border-red-100 shadow-sm">
                    Mohon maaf, Asisten Desa sedang melayani banyak antrean. Silakan hubungi via WhatsApp.
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all placeholder:text-gray-400"
                  value={input || ""}
                  placeholder="Ketik pertanyaan Anda..."
                  onChange={handleInputChange}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input?.trim()}
                  className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-900 disabled:opacity-50 disabled:hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Icon name="send" className="text-sm ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gray-900 text-white rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all ${!isOpen ? "cursor-grab active:cursor-grabbing hover:scale-105" : "hover:bg-gray-800"}`}
      >
        <Icon name={isOpen ? "keyboard_arrow_down" : "support_agent"} className="text-2xl" />
      </button>
    </motion.div>
  );
}
