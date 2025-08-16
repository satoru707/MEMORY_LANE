"use client";
import React, { useState } from "react";
import { Search, Plus, Cloud, CloudOff, Menu, Bell, User } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onCreateMemory: () => void;
  onToggleSidebar: () => void;
  onShowNotifications?: () => void;
  syncStatus: "online" | "offline" | "syncing";
  notificationCount?: number;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onCreateMemory,
  onToggleSidebar,
  onShowNotifications,
  syncStatus,
  notificationCount = 0,
  className,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const syncIcons = {
    online: Cloud,
    offline: CloudOff,
    syncing: Cloud,
  };

  const SyncIcon = syncIcons[syncStatus];

  return (
    <header
      className={cn(
        "bg-white border-b border-neutral-200 sticky top-0 z-40",
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ML</span>
              </div>
              <h1 className="text-xl font-display font-bold text-neutral-900 hidden sm:block">
                Memory Lane
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Sync Status */}
            <div
              className={cn(
                "flex items-center space-x-2 px-2 py-1 rounded-lg text-sm",
                syncStatus === "online" && "text-success-700 bg-success-50",
                syncStatus === "offline" && "text-neutral-500 bg-neutral-50",
                syncStatus === "syncing" && "text-primary-700 bg-primary-50"
              )}
            >
              <SyncIcon
                className={cn(
                  "w-4 h-4",
                  syncStatus === "syncing" && "animate-pulse"
                )}
              />
              <span className="hidden sm:inline">
                {syncStatus === "online"
                  ? "Synced"
                  : syncStatus === "offline"
                  ? "Offline"
                  : "Syncing..."}
              </span>
            </div>

            {/* Quick Add */}
            <Button
              variant="primary"
              size="icon"
              onClick={onCreateMemory}
              className="relative"
            >
              <Plus className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onShowNotifications}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Button>

            {/* Profile */}
            <Button
              onClick={() => localStorage.setItem("route", "settings")}
              variant="ghost"
              size="icon"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="pb-4 md:hidden">
            <Input
              placeholder="Search memories, tags, dates..."
              className="bg-neutral-50 border-neutral-200"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
