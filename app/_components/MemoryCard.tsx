"use client";
import React from "react";
import {
  Calendar,
  MapPin,
  MoreHorizontal,
  Heart,
  Cloud,
  CloudOff,
} from "lucide-react";
import { Memory } from "@/types/types";
import Card from "./ui/Card";
import Tag from "./ui/Tag";
import Button from "./ui/Button";
import { cn } from "../_lib/utils";

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onClick,
  onEdit,
  onDelete,
}) => {
  const moodColors = {
    joyful: "bg-yellow-100 text-yellow-800 border-yellow-200",
    peaceful: "bg-blue-100 text-blue-800 border-blue-200",
    excited: "bg-orange-100 text-orange-800 border-orange-200",
    nostalgic: "bg-purple-100 text-purple-800 border-purple-200",
    grateful: "bg-green-100 text-green-800 border-green-200",
    reflective: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const syncIcons = {
    synced: Cloud,
    pending: Cloud,
    offline: CloudOff,
  };

  const SyncIcon = syncIcons[memory.syncStatus || "synced"];

  return (
    <Card hover className="cursor-pointer" onClick={onClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 text-lg">
              {memory.title}
            </h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-neutral-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(memory.date).toLocaleDateString()}</span>
              </div>
              {memory.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sync Status */}
            <div
              className={cn(
                "flex items-center",
                memory.syncStatus === "pending" && "text-warning-600",
                memory.syncStatus === "offline" && "text-neutral-400"
              )}
            >
              <SyncIcon className="w-4 h-4" />
            </div>

            {/* More Menu */}
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image Thumbnail */}
        {memory.images && memory.images.length > 0 && (
          <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
            <img
              src={memory.images[0]}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
            {memory.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                +{memory.images.length - 1} more
              </div>
            )}
          </div>
        )}

        {/* Content Summary */}
        <p className="text-neutral-600 leading-relaxed">
          {memory.summary || memory.content.slice(0, 150)}
          {memory.content.length > 150 && "..."}
        </p>

        {/* Tags and Mood */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {memory.mood && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                  moodColors[memory.mood]
                )}
              >
                <Heart className="w-3 h-3 mr-1" />
                {memory.mood}
              </span>
            )}
            {memory.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
            {memory.tags.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{memory.tags.length - 3} more
              </span>
            )}
          </div>

          {memory.isAiGenerated && (
            <div className="flex items-center space-x-1 text-xs text-primary-600">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              <span>AI</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MemoryCard;
