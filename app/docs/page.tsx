"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Upload, AlertCircle, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function Docs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([]);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("pdf")) {
      const errorMsg = "Please upload a PDF file";
      setError(errorMsg);
      toast({
        title: "Invalid file type",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = "File size must be less than 10MB";
      setError(errorMsg);
      toast({
        title: "File too large",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      setPdfContent(text.slice(0, 1000));
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "PDF uploaded successfully! You can now ask questions about its content."
      }]);
      toast({
        title: "PDF Uploaded",
        description: "You can now ask questions about the PDF content.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to read PDF";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    setLoading(true);
    setError(null);
    try {
      const analysisMessage = pdfContent 
        ? `Context from PDF: ${pdfContent}\n\nQuestion: ${userMessage}`
        : userMessage;

      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: analysisMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze message');
      }

      const data = await response.json();
      const aiResponse = data.result || data.message || JSON.stringify(data);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      
      toast({
        title: "Response received",
        description: "New message from AI.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Unable to complete analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <div className="flex-none p-4 border-b">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              AI Chat Assistant
            </span>
          </h1>
          {/* PDF Upload Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
              disabled={loading}
            />
            <label
              htmlFor="pdf-upload"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Upload PDF
            </label>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Textarea
              placeholder={pdfContent ? "Ask about the PDF or any other question..." : "Type your message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[60px] max-h-[180px] flex-grow resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              className="h-auto px-6"
              disabled={loading || !message.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Send</span>
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}