"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, FileText, Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-6xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-6xl font-bold tracking-tighter">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
            AI Assistant Platform
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
          Your all-in-one solution for AI-powered document analysis, video summaries, and intelligent conversations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full stagger-animation">
        <Link href="/chat" className="group">
          <Card className="p-6 backdrop-blur-sm bg-card/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors animate-pulse-slow">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Ask AI</h2>
              <p className="text-muted-foreground">Get instant answers to your questions using advanced AI technology</p>
            </div>
          </Card>
        </Link>

        <Link href="/docs" className="group">
          <Card className="p-6 backdrop-blur-sm bg-card/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors animate-pulse-slow">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Document Analysis</h2>
              <p className="text-muted-foreground">Upload PDFs and get AI-powered insights and analysis</p>
            </div>
          </Card>
        </Link>

        <Link href="/summary" className="group">
          <Card className="p-6 backdrop-blur-sm bg-card/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors animate-pulse-slow">
                <Youtube className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Video Summary</h2>
              <p className="text-muted-foreground">Generate concise summaries of YouTube videos using AI</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="w-full max-w-3xl mx-auto p-8 rounded-lg bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm animate-shimmer">
        <div className="flex items-center justify-center space-x-2 text-lg font-medium">
          <Sparkles className="h-5 w-5 text-primary animate-pulse-slow" />
          <span>Powered by advanced AI technology</span>
        </div>
      </div>
    </div>
  );
}