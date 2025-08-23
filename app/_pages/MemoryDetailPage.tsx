"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Share,
  Download,
  Heart,
  MapPin,
  Calendar,
  Tag as TagIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Modal from "@/components/ui/Modal";
import { Memory } from "@/types/types";
import { db } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import Image from "next/image";

interface MemoryDetailPageProps {
  memoryId: string;
  onBack: () => void;
  onEdit: (memory: Memory) => void;
  onShareMemory?: (memory: Memory) => void;
}

const MemoryDetailPage: React.FC<MemoryDetailPageProps> = ({
  memoryId,
  onBack,
  onEdit,
  onShareMemory,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch the memory reactively from Dexie
  const memory = useLiveQuery(() => db.memories.get(memoryId), [memoryId]);

  // Handle case where memory is not found or still loading
  if (!memory) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-500">
          Loading memory or memory not found...
        </p>
      </div>
    );
  }

  const moodColors = {
    joyful: "bg-yellow-100 text-yellow-800 border-yellow-200",
    peaceful: "bg-blue-100 text-blue-800 border-blue-200",
    excited: "bg-orange-100 text-orange-800 border-orange-200",
    nostalgic: "bg-purple-100 text-purple-800 border-purple-200",
    grateful: "bg-green-100 text-green-800 border-green-200",
    reflective: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Timeline</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onEdit(memory)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onShareMemory?.(memory); // Pass memory object
              }}
              size="icon"
            >
              {memory.isPublic ? (
                <Download className="w-4 h-4" />
              ) : (
                <Share className="w-4 h-4" />
              )}{" "}
            </Button>
            {/* add download functionality */}
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Content */}
          <Card className="space-y-6">
            {/* Title and Metadata */}
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-bold text-neutral-900">
                {memory.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(memory.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {memory.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{memory.location}</span>
                  </div>
                )}

                {memory.mood && (
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        moodColors[memory.mood]
                      }`}
                    >
                      {memory.mood}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {memory.images && memory.images.length > 0 && (
              <div className="space-y-4">
                {memory.images.length === 1 ? (
                  <div
                    className="aspect-video bg-neutral-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(0)}
                  >
                    <Image
                      src={memory.images[0]}
                      alt={memory.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {memory.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(index)}
                      >
                        <Image
                          src={image}
                          alt={`${memory.title} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-neutral max-w-none">
              <div className="whitespace-pre-wrap text-neutral-800 leading-relaxed">
                {memory.content}
              </div>
            </div>

            {/* Tags */}
            {memory.tags &&
              memory.tags.length > 0 && ( // Add null check for tags
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TagIcon className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700">
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {memory.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              )}
          </Card>

          {/* AI Summary */}
          {memory.summary && (
            <Card className="bg-primary-50 border-primary-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold text-sm">AI</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary-900">AI Summary</h3>
                  <p className="text-primary-800 leading-relaxed">
                    {memory.summary}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Metadata */}
          <Card className="bg-neutral-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-neutral-700">Created:</span>
                <span className="ml-2 text-neutral-600">
                  {new Date(memory.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-neutral-700">
                  Last updated:
                </span>
                <span className="ml-2 text-neutral-600">
                  {new Date(memory.updatedAt).toLocaleString()}
                </span>
              </div>
              {memory.isAiGenerated && (
                <div>
                  <span className="font-medium text-neutral-700">
                    AI Enhanced:
                  </span>
                  <span className="ml-2 text-primary-600">Yes</span>
                </div>
              )}
              <div>
                <span className="font-medium text-neutral-700">
                  Sync Status:
                </span>
                <span
                  className={`ml-2 ${
                    memory.syncStatus === "synced"
                      ? "text-success-600"
                      : memory.syncStatus === "pending"
                      ? "text-warning-600"
                      : "text-neutral-500"
                  }`}
                >
                  {memory.syncStatus === "synced"
                    ? "Synced"
                    : memory.syncStatus === "pending"
                    ? "Pending"
                    : "Offline"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Image Lightbox */}
      <Modal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        size="full"
      >
        <div className="relative">
          {memory.images && (
            <Image
              src={memory.images[currentImageIndex]}
              alt={`${memory.title} ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-screen object-contain"
            />
          )}

          {memory.images && memory.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {memory.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MemoryDetailPage;
