"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Youtube, AlertCircle, Send, Clock, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Message {
  type: 'question' | 'answer';
  content: string;
  timestamp: Date;
}

interface VideoData {
  title?: string;
  description?: string;
  duration?: string;
  [key: string]: any;
}

interface HistoryItem {
  url: string;
  summary: string;
  videoData: VideoData;
  timestamp: Date;
  title?: string;
}

interface SummaryResponse {
  summary: string;
  video_data: VideoData;
}

interface QuestionResponse {
  answer: string;
}

const Summary: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('videoSummaryHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          // Ensure timestamps are converted back to Date objects
          const hydratedHistory = parsedHistory.map((item: HistoryItem) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }));
          setHistory(hydratedHistory);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        // If there's an error, try to recover by clearing the corrupted data
        localStorage.removeItem('videoSummaryHistory');
      }
    };

    if (isClient) {
      loadHistory();
    }
  }, [isClient]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isClient && history.length > 0) {
      try {
        localStorage.setItem('videoSummaryHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    }
  }, [history, isClient]);

  // Check if there's a current summary in localStorage on mount
  useEffect(() => {
    if (isClient) {
      try {
        const savedCurrentSummary = localStorage.getItem('currentSummary');
        if (savedCurrentSummary) {
          const { url, summary, videoData } = JSON.parse(savedCurrentSummary);
          setUrl(url);
          setSummary(summary);
          setVideoData(videoData);
        }
      } catch (error) {
        console.error('Failed to load current summary:', error);
      }
    }
  }, [isClient]);

  // Save current summary to localStorage when it changes
  useEffect(() => {
    if (isClient && summary) {
      try {
        localStorage.setItem('currentSummary', JSON.stringify({ url, summary, videoData }));
      } catch (error) {
        console.error('Failed to save current summary:', error);
      }
    }
  }, [url, summary, videoData, isClient]);

  const addToHistory = (url: string, summary: string, videoData: VideoData) => {
    const newHistoryItem: HistoryItem = {
      url,
      summary,
      videoData,
      timestamp: new Date(),
      title: videoData?.title || url
    };
    setHistory((prev: HistoryItem[]) => [newHistoryItem, ...prev.slice(0, 9)]); // Keep only last 10 items
  };

  const loadFromHistory = (item: HistoryItem) => {
    setUrl(item.url);
    setSummary(item.summary);
    setVideoData(item.videoData);
    setMessages([]);
    // Save the loaded summary as current
    if (isClient) {
      localStorage.setItem('currentSummary', JSON.stringify({
        url: item.url,
        summary: item.summary,
        videoData: item.videoData
      }));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('videoSummaryHistory');
    localStorage.removeItem('currentSummary');
    toast({
      title: "Success",
      description: "History cleared successfully!",
    });
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          url,
          model: "llama3-70b-8192"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate summary");
      }

      const data: SummaryResponse = await response.json();
      setSummary(data.summary);
      setVideoData(data.video_data);
      addToHistory(url, data.summary, data.video_data);
      
      toast({
        title: "Success",
        description: "Summary generated successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate summary";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a video URL and a question",
        variant: "destructive",
      });
      return;
    }

    if (!summary) {
      toast({
        title: "Error",
        description: "Please generate a summary first before asking questions",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Message = {
      type: 'question',
      content: question,
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, newQuestion]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          question: newQuestion.content,
          model: "llama3-70b-8192"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process question');
      }

      const data: QuestionResponse = await response.json();
      
      const newAnswer: Message = {
        type: 'answer',
        content: data.answer,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, newAnswer]);
      
      toast({
        title: "Success",
        description: "Answer generated successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      const message = error instanceof Error ? error.message : "Failed to process question";
      
      const errorAnswer: Message = {
        type: 'answer',
        content: `Error: ${message}. Please try asking your question again.`,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorAnswer]);
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewSummary = () => {
    setUrl("");
    setSummary("");
    setVideoData(null);
    setMessages([]);
    setError(null);
    localStorage.removeItem('currentSummary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Button
              className="gap-2 bg-transparent hover:bg-accent/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          {summary && (
            <Button
              onClick={handleNewSummary}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Youtube className="h-4 w-4" />
              New Summary
            </Button>
          )}
        </div>

        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Video Summary
            </span>
          </h1>
          <p className="text-muted-foreground animate-slide-up">
            Get AI-generated summaries of YouTube videos
          </p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-card/50 transition-all duration-300">
          <div className="space-y-4">
            {!summary && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                    value={url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    className={cn(
                      "transition-all duration-200 focus:ring-2 focus:ring-primary/50",
                      error ? 'border-red-500' : ''
                    )}
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  disabled={loading || !url.trim()}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  {loading ? "Generating Summary..." : "Generate Summary"}
                </Button>
              </form>
            )}

            {summary && (
              <>
                <div className="text-center text-muted-foreground mb-4">
                  <p>Summary generated for: {videoData?.title}</p>
                </div>
                <Card className="p-6 backdrop-blur-sm bg-card/50">
                  <h2 className="text-xl font-semibold mb-4">Summary</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary}
                    </ReactMarkdown>
                  </div>
                </Card>
              </>
            )}
          </div>
        </Card>

        {/* Suggestions Section */}
        {history.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Previously Summarized Videos</h2>
              <Button
                className="text-muted-foreground hover:text-foreground h-9 px-3"
                onClick={clearHistory}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.slice(0, 6).map((item: HistoryItem, index: number) => (
                <Card
                  key={index}
                  className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate mb-1">{item.title || item.url}</h3>
                      <p className="text-sm text-muted-foreground truncate mb-2">{item.url}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <Card className="p-6 backdrop-blur-sm bg-card/50 mb-20">
            <div className="space-y-6">
              {messages.map((message: Message, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg",
                    message.type === 'question'
                      ? 'bg-primary/10 ml-auto max-w-[80%]'
                      : 'bg-muted mr-auto max-w-[80%]'
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Summary;
