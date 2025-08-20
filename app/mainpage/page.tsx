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
import ProfilePage from "@/pages/ProfilePage";
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
  // if online or offline
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

  useEffect(() => {
    setInterval(() => {
      if (localStorage.getItem("route")) {
        setCurrentPage(localStorage.getItem("route"));
        localStorage.removeItem("route");
      }
    }, 1000); // Show notifications every 5 seconds
  });

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

  // Pass memory to CreateMemoryModal for editing
  const handleEditMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    setCreateModalOpen(true);
    setViewingMemoryDetail(null);
  };

  const handleDeleteMemory = async (memoryId: string) => {
    console.log("Attempting to delete memory:", memoryId);
    // Assume successful delete from backend for now
    // In a real app, you'd make an API call here, e.g., await deleteMemoryFromBackend(memoryId);

    if (isOnline) {
      console.log("Simulating backend delete for memory:", memoryId);
      // Actual backend delete API call here
    } else {
      console.log("Queueing offline delete for memory:", memoryId);
      await db.offline_changes.add({
        type: "delete",
        collection: "memories",
        data: { id: memoryId } as Memory, // Only need ID for delete
        timestamp: Date.now(),
      });
    }
    await db.memories.delete(memoryId); // Delete from local Dexie store
  };

  const handleShareMemory = async (memory: Memory) => {
    console.log("Attempting to toggle share status for memory:", memory.id);
    const updatedMemory = {
      ...memory,
      isPublic: !memory.isPublic,
      updatedAt: new Date().toISOString(),
    }; // Toggle isPublic

    if (isOnline) {
      console.log(
        "Simulating backend update for memory share status:",
        updatedMemory.id
      );
      // Actual backend update API call here to toggle isPublic
    } else {
      console.log(
        "Queueing offline update for memory share status:",
        updatedMemory.id
      );
      await db.offline_changes.add({
        type: "update",
        collection: "memories",
        data: updatedMemory,
        timestamp: Date.now(),
      });
    }
    await db.memories.put(updatedMemory); // Update in local Dexie store
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
        onShareMemory={handleShareMemory}
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
        syncStatus={isOnline ? "online" : "offline"}
        notificationCount={notifications.filter((n) => !n.read).length}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
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
                    onEditMemory={handleEditMemory} // Pass handleEditMemory
                    onDeleteMemory={handleDeleteMemory} // Pass handleDeleteMemory
                    onShareMemory={handleShareMemory} // Pass handleShareMemory
                  />
                </div>
              </div>
            </div>
          )}

          {currentPage === "search" && (
            <SearchPage
              onMemoryClick={handleMemoryClick}
              onEditMemory={handleEditMemory}
              onDeleteMemory={handleDeleteMemory}
              onShareMemory={handleShareMemory}
            />
          )}
          {currentPage === "tags" && <TagsPage />}
          {currentPage === "stories" && <StoryGeneratorPage />}
          {currentPage === "settings" && <SettingsPage />}
          {currentPage === "family" && <FamilyTimelinePage />}
          {currentPage === "privacy" && <PrivacySettingsPage />}
          {currentPage === "analytics" && <AnalyticsPage />}
          {currentPage === "admin" && <AdminPage />}
          {currentPage === "profile" && <ProfilePage />}
        </main>
      </div>

      {/* Create Memory Modal */}
      <CreateMemoryModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedMemory(null); // Reset selectedMemory when modal closes
        }}
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
      {/* close sidebar if outside is clicked */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
