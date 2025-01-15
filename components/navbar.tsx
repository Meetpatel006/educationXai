"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain, FileText, Youtube, MessageSquare } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Docs",
      href: "/docs",
      icon: FileText,
    },
    {
      name: "Summary",
      href: "/summary",
      icon: Youtube,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
        >
          <Brain className="h-6 w-6" />
          <span className="font-bold">AI Platform</span>
        </Link>
        <div className="flex gap-6 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105",
                  pathname === item.href
                    ? "text-primary scale-105"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}