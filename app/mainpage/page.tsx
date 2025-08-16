"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Timeline from "@/components/Timeline";
import CreateMemoryModal from "@/components/CreateMemoryModal";
import MemoryDetailPage from "@/pages/MemoryDetailPage";
import SearchPage from "@/pages/SearchPage";
import TagsPage from "@/pages/TagsPage";
import StoryGeneratorPage from "@/pages/StoryGeneratorPage";
import SettingsPage from "@/pages/SettingsPage";
import AdminPage from "@/pages/AdminPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import FamilyTimelinePage from "@/pages/FamilyTimelinePage";
import PrivacySettingsPage from "@/pages/PrivacySettingPage";
import OfflineBanner from "@/components/ui/OfflineBanner";
import NotificationToast from "@/components/ui/NotificationToast";
import { sampleMemories } from "@/data/sampleData";
import { Memory } from "@/types/types";
import { useNetworkStatus, db } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";

function App() {
  const [currentPage, setCurrentPage] = useState("timeline");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const isOnline = useNetworkStatus();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [viewingMemoryDetail, setViewingMemoryDetail] = useState<string | null>(
    null
  );
  const memories = useLiveQuery(() => db.memories.toArray(), []) || [];
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      type: "memory_shared" as const,
      title: "Mom shared a memory",
      message:
        "Family Thanksgiving Dinner - What an amazing Thanksgiving we had this year!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "notif-2",
      type: "comment" as const,
      title: "Dad commented on your memory",
      message: "Great photo! I remember that day so well.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "notif-3",
      type: "family_invite" as const,
      title: "Family invitation sent",
      message: "Your invitation to Emma was sent successfully.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ]);

  useEffect(() => {
    const loadInitialMemories = async () => {
      const count = await db.memories.count();
      if (count === 0) {
        // Only load sample data if the database is empty
        sampleMemories.forEach(async (mem) => {
          await db.memories.put(mem);
        });
      }
    };
    loadInitialMemories();
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncOfflineChanges();
    }
  }, [isOnline]);

  const syncOfflineChanges = async () => {
    console.log("Attempting to sync offline changes...");
    const changes = await db.offline_changes.toArray();
    console.log(changes);

    for (const change of changes) {
      try {
        // Simulate API call
        console.log(
          `Syncing ${change.type} for ${change.collection} with data:`,
          change.data
        );
        // In a real app, make your actual API call here based on change.type (add/update/delete)
        // Example: await fetch('/api/memories', { method: 'POST', body: JSON.stringify(change.data) });

        // On successful sync, update memory status and remove from offline_changes
        const syncedMemory = { ...change.data, syncStatus: "synced" } as Memory;
        await db.memories.put(syncedMemory);
        await db.offline_changes.delete(change.id!);
        console.log(
          "Successfully synced and updated local database:",
          syncedMemory
        );
      } catch (error) {
        console.error("Error syncing offline change:", change, error);
        // Handle errors: maybe retry later, or notify user
      }
    }
  };

  const handleCreateMemory = (newMemory: Partial<Memory>) => {
    // No need to setMemories directly here, useLiveQuery will handle it
    // The CreateMemoryModal already saves to db.memories
  };

  const handleMemoryClick = (memory: Memory) => {
    setViewingMemoryDetail(memory.id);
  };

  const handleBackToTimeline = () => {
    setViewingMemoryDetail(null);
  };

  const handleEditMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    setCreateModalOpen(true);
    setViewingMemoryDetail(null);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Memory Detail View
  if (viewingMemoryDetail) {
    return (
      <MemoryDetailPage
        memoryId={viewingMemoryDetail}
        onBack={handleBackToTimeline}
        onEdit={handleEditMemory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Offline Banner */}
      <OfflineBanner isVisible={!isOnline} />

      {/* Header */}
      <Header
        onCreateMemory={() => setCreateModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onShowNotifications={() => setShowNotifications(!showNotifications)}
        //set sync status
        syncStatus="online"
        notificationCount={notifications.filter((n) => !n.read).length}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-32">
          {currentPage === "timeline" && (
            <div className="min-h-screen bg-neutral-50">
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-display font-bold text-neutral-900">
                        Your Timeline
                      </h1>
                      <p className="text-neutral-600 mt-1">
                        Explore your memories organized by time
                      </p>
                    </div>
                  </div>

                  <Timeline
                    memories={memories}
                    onMemoryClick={handleMemoryClick}
                  />
                </div>
              </div>
            </div>
          )}

          {currentPage === "search" && <SearchPage />}
          {currentPage === "tags" && <TagsPage />}
          {currentPage === "stories" && <StoryGeneratorPage />}
          {currentPage === "settings" && <SettingsPage />}
          {currentPage === "family" && <FamilyTimelinePage />}
          {currentPage === "privacy" && <PrivacySettingsPage />}
          {currentPage === "analytics" && <AnalyticsPage />}
          {currentPage === "admin" && <AdminPage />}
        </main>
      </div>

      {/* Create Memory Modal */}
      <CreateMemoryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateMemory}
        editingMemory={selectedMemory || undefined}
      />

      <NotificationToast
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClose={() => setShowNotifications(false)}
        isOpen={showNotifications}
      />
    </div>
  );
}

export default App;
