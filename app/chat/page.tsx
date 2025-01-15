"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8585/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Server error:", data);
        throw new Error(data.detail || "Failed to get answer");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process your request. Please try again.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try rephrasing your question or try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (messages.length < 1) return;
    const lastUserMessage = messages.findLast(m => m.role === "user");
    if (!lastUserMessage) return;
    
    // Remove the last error message if it exists
    setMessages(prev => prev.filter((_, index) => index !== prev.length - 1));
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8585/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: lastUserMessage.content }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process your request. Please try again.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try rephrasing your question or try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] px-4">
      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-8">
        {/* Title Section */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold text-white">Chat Assistant</h1>
          <p className="text-gray-400 text-lg">
            Get AI-powered assistance for your questions
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Bot className="h-12 w-12 text-gray-400 mb-4 animate-bounce" />
              <h2 className="text-2xl font-semibold text-white mb-2">
                Start a Conversation
              </h2>
              <p className="text-gray-400 max-w-md">
                Type your message below to begin chatting.
              </p>
            </div>
          ) : (
            <div className="space-y-6 mb-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === "assistant" ? "bg-[#2a2a2a]" : "bg-[#2a2a2a]"
                  )}>
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5 text-gray-400" />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-lg max-w-[80%]",
                    message.role === "assistant" 
                      ? "bg-[#1e1e1e] text-gray-200" 
                      : "bg-[#2a2a2a] text-gray-200"
                  )}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-invert prose-sm max-w-none"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <Bot className="h-5 w-5 text-gray-400" />
              </div>
              <div className="bg-[#1e1e1e] rounded-lg px-4 py-2">
                <p className="text-gray-400">Thinking...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Retry Last Message
              </Button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-6 mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#1A1A1A] border-0 rounded-xl py-6 pl-6 pr-12 text-gray-200 placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 transition-all duration-200 hover:bg-[#222222]"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white bg-transparent hover:bg-transparent transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin">⌛</div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 