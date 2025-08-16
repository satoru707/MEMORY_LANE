import React, { useState } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Share,
  Filter,
  Calendar,
} from "lucide-react";
import MemoryCard from "@/components/MemoryCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Input from "@/components/ui/Input";
import { Memory } from "@/types/types";
import { sampleMemories } from "@/data/sampleData";

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship: string;
}

interface SharedMemory extends Memory {
  sharedBy: FamilyMember;
  sharedAt: string;
  comments: Array<{
    id: string;
    author: FamilyMember;
    content: string;
    createdAt: string;
  }>;
  reactions: Array<{
    id: string;
    author: FamilyMember;
    type: "heart" | "smile" | "wow";
  }>;
}

const FamilyTimelinePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [newComment, setNewComment] = useState("");
  const [activeCommentMemory, setActiveCommentMemory] = useState<string | null>(
    null
  );

  const familyMembers: FamilyMember[] = [
    {
      id: "mom",
      name: "Mom",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      relationship: "Mother",
    },
    {
      id: "dad",
      name: "Dad",
      relationship: "Father",
    },
    {
      id: "sister",
      name: "Emma",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      relationship: "Sister",
    },
  ];

  // Convert sample memories to shared memories
  const sharedMemories: SharedMemory[] = sampleMemories
    .slice(0, 4)
    .map((memory, index) => ({
      ...memory,
      sharedBy: familyMembers[index % familyMembers.length],
      sharedAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      comments: [
        {
          id: "comment-1",
          author: familyMembers[(index + 1) % familyMembers.length],
          content: "What a beautiful memory! Thanks for sharing this with us.",
          createdAt: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ],
      reactions: [
        {
          id: "reaction-1",
          author: familyMembers[(index + 2) % familyMembers.length],
          type: "heart" as const,
        },
      ],
    }));

  const filteredMemories =
    selectedMember === "all"
      ? sharedMemories
      : sharedMemories.filter(
          (memory) => memory.sharedBy.id === selectedMember
        );

  const handleAddComment = (memoryId: string) => {
    if (newComment.trim()) {
      // In real app, this would make an API call
      console.log("Adding comment:", newComment, "to memory:", memoryId);
      setNewComment("");
      setActiveCommentMemory(null);
    }
  };

  const handleReaction = (
    memoryId: string,
    type: "heart" | "smile" | "wow"
  ) => {
    // In real app, this would make an API call
    console.log("Adding reaction:", type, "to memory:", memoryId);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <main className="flex">
          <div className="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold text-neutral-900">
                    Family Timeline
                  </h1>
                  <p className="text-neutral-600 mt-1">
                    Memories shared by your family members
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Button variant="secondary" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date Range
                  </Button>
                </div>
              </div>

              {/* Family Member Filter */}
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-neutral-700">
                    Show memories from:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedMember("all")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedMember === "all"
                          ? "bg-primary-100 text-primary-800 border border-primary-200"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      All Family
                    </button>
                    {familyMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedMember(member.id)}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedMember === member.id
                            ? "bg-primary-100 text-primary-800 border border-primary-200"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-5 h-5 rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 bg-neutral-300 rounded-full flex items-center justify-center">
                            <span className="text-xs text-neutral-600">
                              {member.name[0]}
                            </span>
                          </div>
                        )}
                        <span>{member.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Shared Memories */}
              <div className="space-y-6">
                {filteredMemories.map((memory) => (
                  <Card key={memory.id} className="space-y-4">
                    {/* Shared By Header */}
                    <div className="flex items-center space-x-3 pb-3 border-b border-neutral-200">
                      {memory.sharedBy.avatar ? (
                        <img
                          src={memory.sharedBy.avatar}
                          alt={memory.sharedBy.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-neutral-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-neutral-900">
                            {memory.sharedBy.name}
                          </h3>
                          <span className="text-sm text-neutral-500">
                            shared a memory
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {new Date(memory.sharedAt).toLocaleDateString()} •{" "}
                          {memory.sharedBy.relationship}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Memory Content */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                          {memory.title}
                        </h2>
                        <div className="flex items-center space-x-3 text-sm text-neutral-500 mb-3">
                          <span>
                            {new Date(memory.date).toLocaleDateString()}
                          </span>
                          {memory.location && (
                            <>
                              <span>•</span>
                              <span>{memory.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Image */}
                      {memory.images && memory.images.length > 0 && (
                        <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                          <img
                            src={memory.images[0]}
                            alt={memory.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <p className="text-neutral-700 leading-relaxed">
                        {memory.content.length > 300
                          ? `${memory.content.slice(0, 300)}...`
                          : memory.content}
                      </p>

                      {/* Tags and Mood */}
                      <div className="flex items-center space-x-2">
                        {memory.mood && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <Heart className="w-3 h-3 mr-1" />
                            {memory.mood}
                          </span>
                        )}
                        {memory.tags.slice(0, 3).map((tag) => (
                          <Tag key={tag} size="sm">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    {/* Reactions and Comments */}
                    <div className="pt-3 border-t border-neutral-200 space-y-3">
                      {/* Reactions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleReaction(memory.id, "heart")}
                            className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-red-600 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{memory.reactions.length}</span>
                          </button>
                          <button
                            onClick={() =>
                              setActiveCommentMemory(
                                activeCommentMemory === memory.id
                                  ? null
                                  : memory.id
                              )
                            }
                            className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{memory.comments.length}</span>
                          </button>
                        </div>
                        <div className="flex items-center space-x-1">
                          {memory.reactions
                            .slice(0, 3)
                            .map((reaction, index) => (
                              <div
                                key={reaction.id}
                                className="flex items-center"
                              >
                                {reaction.author.avatar ? (
                                  <img
                                    src={reaction.author.avatar}
                                    alt={reaction.author.name}
                                    className="w-6 h-6 rounded-full border-2 border-white"
                                    style={{
                                      marginLeft: index > 0 ? "-8px" : "0",
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="w-6 h-6 bg-neutral-200 rounded-full border-2 border-white flex items-center justify-center"
                                    style={{
                                      marginLeft: index > 0 ? "-8px" : "0",
                                    }}
                                  >
                                    <span className="text-xs text-neutral-600">
                                      {reaction.author.name[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Comments */}
                      {memory.comments.length > 0 && (
                        <div className="space-y-2">
                          {memory.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex items-start space-x-3"
                            >
                              {comment.author.avatar ? (
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-neutral-600">
                                    {comment.author.name[0]}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 bg-neutral-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-neutral-900 text-sm">
                                    {comment.author.name}
                                  </span>
                                  <span className="text-xs text-neutral-500">
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-700">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      {activeCommentMemory === memory.id && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              You
                            </span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleAddComment(memory.id)
                              }
                            />
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(memory.id)}
                                disabled={!newComment.trim()}
                              >
                                Comment
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveCommentMemory(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredMemories.length === 0 && (
                <Card className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No shared memories yet
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {selectedMember === "all"
                      ? "Your family hasn't shared any memories yet."
                      : `${
                          familyMembers.find((m) => m.id === selectedMember)
                            ?.name
                        } hasn't shared any memories yet.`}
                  </p>
                  <Button variant="secondary">Invite Family Members</Button>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FamilyTimelinePage;
