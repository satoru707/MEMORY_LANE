import React, { useState } from "react";
import { Filter, MessageCircle, Heart, Users, Trash } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import Card from "@/components/ui/Card";
import { Memory } from "@/types/types";
import {
  sampleFamilyMembers,
  sampleUser,
  familyMemories,
} from "@/data/sampleData";
import { db, useNetworkStatus } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import DatePicker from "@/components/ui/DatePicker";
import Modal from "@/components/ui/Modal";
import MultiSelect from "@/components/ui/MultiSelect";
import { Comment, Like } from "@/lib/utils";

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string; // Made optional as it might not always be present
}

interface SharedMemory extends Memory {
  sharedBy: FamilyMember;
  sharedAt: string;
  comments: {
    id: string;
    author: FamilyMember;
    content: string;
    createdAt: string;
    syncStatus?: "synced" | "pending" | "offline";
  }[];
  reactions: {
    id: string;
    author: FamilyMember;
    type: "heart" | "smile" | "wow";
    syncStatus?: "synced" | "pending" | "offline";
  }[];
  isLikedByCurrentUser: boolean; // New property
}

const FamilyTimelinePage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [newComment, setNewComment] = useState("");
  const [activeCommentMemory, setActiveCommentMemory] = useState<string | null>(
    null
  );
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Fetch all memories from Dexie
  const currentUserMemories =
    useLiveQuery(
      () => db.memories.where({ userId: "user-sarah" }).toArray(),
      []
    ) || [];
  const allDexieMemories = useLiveQuery(() => db.memories.toArray(), []) || [];
  const allLikes = useLiveQuery(() => db.likes.toArray(), []) || [];
  const allComments = useLiveQuery(() => db.comments.toArray(), []) || [];

  // Helper function to get user details by ID
  const getUserById = (userId: string): FamilyMember => {
    if (userId === sampleUser.id) {
      return {
        id: sampleUser.id,
        name: sampleUser.name,
        avatar: sampleUser.avatar,
        relationship: "You",
      };
    }
    const familyMember = sampleFamilyMembers.find(
      (member) => member.id === userId
    );
    if (familyMember) {
      return {
        id: familyMember.id,
        name: familyMember.name,
        avatar: familyMember.avatar,
        relationship: "Family", // Or retrieve actual relationship if available
      };
    }
    // Fallback for unknown users
    return {
      id: userId,
      name: "Unknown User",
      avatar: undefined,
      relationship: "",
    };
  };

  // Convert sample family memories to SharedMemory format and combine with public user memories
  const combinedFamilyTimelineMemories: SharedMemory[] = React.useMemo(() => {
    const mapMemoryToShared = (
      memory: Memory,
      user: FamilyMember
    ): SharedMemory => {
      const memoryLikes = allLikes.filter(
        (like) => like.memoryId === memory.id
      );
      const memoryComments = allComments.filter(
        (comment) => comment.memoryId === memory.id
      );
      const isLiked = memoryLikes.some((like) => like.userId === sampleUser.id); // Check if current user liked this memory

      return {
        ...memory,
        sharedBy: user,
        sharedAt: memory.updatedAt || memory.createdAt,
        comments: memoryComments.map((comment) => ({
          id: comment.id!,
          author: getUserById(comment.userId), // Use getUserById to get the correct author
          content: comment.content,
          createdAt: new Date(comment.timestamp).toISOString(),
          syncStatus: comment.syncStatus,
        })),
        reactions: memoryLikes.map((like) => ({
          id: like.id!,
          author: getUserById(like.userId), // Use getUserById to get the correct author
          type: "heart",
          syncStatus: like.syncStatus,
        })),
        isLikedByCurrentUser: isLiked, // Assign the new property
      };
    };

    const currentUserPublicMemories = currentUserMemories
      .filter((mem) => mem.isPublic)
      .map((mem) =>
        mapMemoryToShared(mem, {
          name: sampleUser.name,
          avatar: sampleUser.avatar,
          relationship: "You",
          id: sampleUser.id,
        } as FamilyMember)
      );

    const otherFamilyMemories = familyMemories.map((fm) =>
      mapMemoryToShared(fm.memory, {
        name: fm.user.name,
        avatar: fm.user.avatar,
        id: fm.user.id,
        relationship: "Family",
      } as FamilyMember)
    );

    return [...currentUserPublicMemories, ...otherFamilyMemories].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [currentUserMemories, familyMemories, allLikes, allComments]);

  const filteredMemories = combinedFamilyTimelineMemories.filter((memory) => {
    const matchesMember =
      selectedMember === "all" || memory.sharedBy.id === selectedMember;
    const memoryDate = new Date(memory.date);
    const matchesDateRange =
      (!startDate || memoryDate >= startDate) &&
      (!endDate || memoryDate <= endDate);
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => memory.tags.includes(tag));
    const matchesMoods =
      selectedMoods.length === 0 ||
      (memory.mood && selectedMoods.includes(memory.mood));

    return matchesMember && matchesDateRange && matchesTags && matchesMoods;
  });

  const availableTags = Array.from(
    new Set(combinedFamilyTimelineMemories.flatMap((mem) => mem.tags))
  );
  const availableMoods = Array.from(
    new Set(
      combinedFamilyTimelineMemories.map((mem) => mem.mood).filter(Boolean)
    )
  ) as string[];

  const isOnline = useNetworkStatus();

  const handleAddComment = async (memoryId: string) => {
    if (newComment.trim()) {
      const commentId = `comment-${Date.now()}`;
      const newCommentData: Comment = {
        id: commentId,
        memoryId,
        userId: sampleUser.id,
        content: newComment.trim(),
        timestamp: Date.now(),
        syncStatus: isOnline ? "synced" : "pending",
      };
      console.log("Attempting to add comment:", newCommentData);

      if (isOnline) {
        console.log("Simulating API call to add comment:", newCommentData);
      } else {
        console.log("Queueing offline comment:", newCommentData);
        await db.offline_changes.add({
          type: "add",
          collection: "comments",
          data: newCommentData,
          timestamp: Date.now(),
        });
      }
      await db.comments.add(newCommentData);
      setNewComment("");
      setActiveCommentMemory(null);
    }
  };

  const handleReaction = async (
    memoryId: string,
    type: "heart" | "smile" | "wow"
  ) => {
    // Check if user has already liked this memory
    const existingLike = allLikes.find(
      (like) => like.memoryId === memoryId && like.userId === sampleUser.id
    );

    if (existingLike) {
      // Unlike the memory
      console.log("Attempting to unlike memory:", memoryId);
      if (isOnline) {
        console.log("Simulating API call to remove reaction:", existingLike.id);
        // In a real app, make API call here to delete the like
      } else {
        console.log("Queueing offline unlike for:", existingLike.id);
        await db.offline_changes.add({
          type: "delete",
          collection: "likes",
          data: existingLike,
          timestamp: Date.now(),
        });
      }
      await db.likes.delete(existingLike.id!); // Delete from local Dexie store
    } else {
      // Like the memory
      const newReaction: Like = {
        id: `like-${Date.now()}`,
        memoryId,
        userId: sampleUser.id, // Assuming current user is sampleUser
        timestamp: Date.now(),
        syncStatus: isOnline ? "synced" : "pending",
      };

      if (isOnline) {
        console.log("Simulating API call to add reaction:", newReaction);
        // In a real app, make API call here to add the like
      } else {
        console.log("Queueing offline reaction:", newReaction);
        await db.offline_changes.add({
          type: "add",
          collection: "likes",
          data: newReaction,
          timestamp: Date.now(),
        });
      }
      await db.likes.add(newReaction);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const commentToDelete = allComments.find(
      (comment) => comment.id === commentId
    );
    if (commentToDelete) {
      if (isOnline) {
        console.log(
          "Simulating API call to delete comment:",
          commentToDelete.id
        );
        // In a real app, make API call here to delete the comment
      } else {
        console.log("Queueing offline delete for comment:", commentToDelete.id);
        await db.offline_changes.add({
          type: "delete",
          collection: "comments",
          data: commentToDelete,
          timestamp: Date.now(),
        });
      }
      await db.comments.delete(commentToDelete.id!);
      console.log("Comment deleted:", commentToDelete.id);
    }
  };

  return (
    <div className="min-h-fit bg-neutral-50">
      <div className="p-9">
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilterModalOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <Modal
            isOpen={filterModalOpen}
            onClose={() => setFilterModalOpen(false)}
            title="Filter Memories"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Date Range
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Start Date"
                    value={
                      startDate ? startDate.toISOString().split("T")[0] : ""
                    }
                    onChange={(date) =>
                      setStartDate(date ? new Date(date) : null)
                    }
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                    onChange={(date) =>
                      setEndDate(date ? new Date(date) : null)
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Tags
                </h3>
                <MultiSelect
                  options={availableTags.map((tag) => ({
                    label: tag,
                    value: tag,
                  }))}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Select tags"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Moods
                </h3>
                <MultiSelect
                  options={availableMoods.map((mood) => ({
                    label: mood,
                    value: mood,
                  }))}
                  value={selectedMoods}
                  onChange={setSelectedMoods}
                  placeholder="Select moods"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedMoods([]);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Modal>

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
                {sampleFamilyMembers.map((member) => (
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

          {/* Shared Memories List */}
          <div className="space-y-6">
            {filteredMemories.length > 0 ? (
              filteredMemories.map((memory) => {
                // Check if current user has liked this memory
                const hasLiked = memory.reactions.some(
                  (reaction) => reaction.author.id === sampleUser.id
                );

                return (
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
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              memory.isLikedByCurrentUser
                                ? "text-red-600"
                                : "text-neutral-600 hover:text-red-600"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                memory.isLikedByCurrentUser
                                  ? "fill-red-600"
                                  : ""
                              }`}
                            />
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
                        <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-50">
                          {memory.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex items-start space-x-3 group relative"
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
                              {comment.author.id === sampleUser.id && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id!)
                                  }
                                  className="absolute top-2 right-2 text-neutral-400 hover:text-destructive-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          {/* {memory.comments.length > 2 && (
                            <p className="text-sm text-neutral-500 text-center">
                              Scroll to see {memory.comments.length - 2} more
                              comment{memory.comments.length - 2 > 1 ? "s" : ""}
                            </p>
                          )} */}
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
                );
              })
            ) : sampleFamilyMembers.length > 0 ? (
              <Card className="text-center py-12">
                <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No memory found
                </h3>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No shared memories yet
                </h3>
                <p className="text-neutral-600 mb-4">
                  {selectedMember === "all"
                    ? "Your family hasn't shared any memories yet."
                    : `${
                        sampleFamilyMembers.find((m) => m.id === selectedMember)
                          ?.name
                      } hasn't shared any memories yet.`}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => localStorage.setItem("route", "settings")}
                >
                  Invite Family Members
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTimelinePage;
