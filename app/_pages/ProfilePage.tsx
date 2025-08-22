import React, { useState } from "react";
import {
  User,
  Camera,
  Edit,
  Settings,
  Calendar,
  Heart,
  Tag as TagIcon,
  MapPin,
  Download,
  TrendingUp,
  Share,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import MemoryCard from "@/components/MemoryCard";
import StatCard from "@/components/ui/StatCard";
import { sampleUser, sampleMemories } from "@/data/sampleData";

const ProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(sampleUser);
  const [activeTab, setActiveTab] = useState<"overview" | "memories" | "stats">(
    "overview"
  );

  const userMemories = sampleMemories.slice(0, 6); // Show recent memories
  const userStats = {
    totalMemories: 247,
    memoriesThisMonth: 18,
    longestStreak: 12,
    favoriteTag: "family",
    topMood: "grateful",
    joinedDate: "2023-03-15",
  };

  const handleSaveProfile = () => {
    // Save profile changes
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // Handle avatar upload
    console.log("Avatar change requested");
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "memories", label: "Recent Memories" },
    { id: "stats", label: "Statistics" },
  ];

  return (
    <div className="min-h-fit bg-neutral-50">
      <div className="flex">
        <main className="flex">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Profile Header */}
              <Card className="relative overflow-hidden">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-primary-400 to-secondary-400"></div>

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 bg-white rounded-full p-2 shadow-soft-lg">
                        {userProfile.avatar ? (
                          <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center">
                            <User className="w-12 h-12 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleAvatarChange}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 mt-4 sm:mt-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input
                            value={userProfile.name}
                            onChange={(e) =>
                              setUserProfile((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="text-2xl font-bold"
                          />
                          <Input
                            value={userProfile.email}
                            onChange={(e) =>
                              setUserProfile((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <h1 className="text-2xl font-bold text-neutral-900">
                            {userProfile.name}
                          </h1>
                          <p className="text-neutral-600">
                            {userProfile.email}
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
                            Member since{" "}
                            {new Date(userStats.joinedDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSaveProfile}>Save</Button>
                          <Button
                            variant="secondary"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button variant="secondary">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Memories"
                  value={userStats.totalMemories.toString()}
                  icon={Calendar}
                />
                <StatCard
                  title="This Month"
                  value={userStats.memoriesThisMonth.toString()}
                  icon={Heart}
                />
                <StatCard
                  title="Longest Streak"
                  value={`${userStats.longestStreak} days`}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Favorite Tag"
                  value={userStats.favoriteTag}
                  icon={TagIcon}
                />
              </div>

              {/* Tabs */}
              <div className="border-b border-neutral-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Recent Activity */}
                    <Card>
                      <div className="p-6 border-b border-neutral-200">
                        <h2 className="text-xl font-semibold text-neutral-900">
                          Recent Activity
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <span className="text-sm text-neutral-600">
                            Created "Family Thanksgiving Dinner" 2 hours ago
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-secondary-600 rounded-full"></div>
                          <span className="text-sm text-neutral-600">
                            Added 3 photos to "Sunrise Hike" yesterday
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                          <span className="text-sm text-neutral-600">
                            Shared "Birthday Party" with family 3 days ago
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Favorite Memories */}
                    <Card>
                      <div className="p-6 border-b border-neutral-200">
                        <h2 className="text-xl font-semibold text-neutral-900">
                          Favorite Memories
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userMemories.slice(0, 4).map((memory) => (
                            <div
                              key={memory.id}
                              className="aspect-video bg-neutral-100 rounded-lg overflow-hidden"
                            >
                              {memory.images && memory.images[0] && (
                                <img
                                  src={memory.images[0]}
                                  alt={memory.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Stats */}
                    <Card>
                      <div className="p-6 border-b border-neutral-200">
                        <h2 className="text-lg font-semibold text-neutral-900">
                          Profile Stats
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Top Mood</span>
                          <span className="font-medium text-neutral-900 capitalize">
                            {userStats.topMood}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">
                            Most Used Tag
                          </span>
                          <span className="font-medium text-neutral-900">
                            {userStats.favoriteTag}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">
                            Current Streak
                          </span>
                          <span className="font-medium text-neutral-900">
                            5 days
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">
                            Average per Week
                          </span>
                          <span className="font-medium text-neutral-900">
                            4.2
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <div className="p-6 border-b border-neutral-200">
                        <h2 className="text-lg font-semibold text-neutral-900">
                          Quick Actions
                        </h2>
                      </div>
                      <div className="p-6 space-y-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export All Data
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share Profile
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Privacy Settings
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "memories" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userMemories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              )}

              {activeTab === "stats" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="text-center space-y-4">
                    <Calendar className="w-12 h-12 text-primary-600 mx-auto" />
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {userStats.totalMemories}
                      </h3>
                      <p className="text-neutral-600">Total Memories</p>
                    </div>
                  </Card>
                  <Card className="text-center space-y-4">
                    <Heart className="w-12 h-12 text-red-500 mx-auto" />
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {userStats.memoriesThisMonth}
                      </h3>
                      <p className="text-neutral-600">This Month</p>
                    </div>
                  </Card>
                  <Card className="text-center space-y-4">
                    <TagIcon className="w-12 h-12 text-secondary-600 mx-auto" />
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        34
                      </h3>
                      <p className="text-neutral-600">Unique Tags</p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
