"use client";
import React from "react";
import {
  Home,
  Search,
  Tag,
  BookOpen,
  Settings,
  TrendingUp,
  Shield,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./ui/Button";
import { analytics, sampleMemories } from "@/data/sampleData";

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
  onClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentPage,
  onNavigate,
  onClick,
}) => {
  const navigation = [
    { name: "Timeline", icon: Home, id: "timeline" },
    { name: "Family", icon: Users, id: "family" },
    { name: "Search", icon: Search, id: "search" },
    { name: "Tags", icon: Tag, id: "tags" },
    { name: "Stories", icon: BookOpen, id: "stories" },
    { name: "Analytics", icon: TrendingUp, id: "analytics" },
    { name: "Settings", icon: Settings, id: "settings" },
    // { name: "Profile", icon: User, id: "profile" },
    { name: "Admin", icon: Shield, id: "admin" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50" />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 ease-in-out",
          "h-full overflow-y-auto z-40", // z-40 for mobile overlay compatibility
          isOpen ? "translate-x-0" : "-translate-x-full", // Mobile slide in/out
          "lg:translate-x-0 lg:z-20 lg:pt-20 lg:pb-4" // Always visible on desktop, lower z-index, adjusted padding
        )}
      >
        <div className="flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id), onClick();
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-900 border border-primary-200"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="px-4 py-4 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-medium text-neutral-900">
                Your Stats
              </h3>
              <div className="space-y-1 text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>Total Memories</span>
                  <span className="font-medium">{analytics.totalMemories}</span>
                </div>
                <div className="flex justify-between">
                  <span>This Month</span>
                  <span className="font-medium">
                    {analytics.memoriesThisMonth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tags</span>
                  <span className="font-medium">
                    {" "}
                    {
                      sampleMemories.filter(
                        (mem) =>
                          mem.date.split("-")[1] ===
                          `${new Date().getMonth() + 1}`
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
