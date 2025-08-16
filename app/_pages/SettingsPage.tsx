"use client";
import React, { useState } from "react";
import {
  User,
  Shield,
  Download,
  Trash2,
  Bot,
  Cloud,
  Bell,
  Palette,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { sampleUser } from "@/data/sampleData";

const SettingsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("account");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userSettings, setUserSettings] = useState(sampleUser);

  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "ai", label: "AI Preferences", icon: Bot },
    { id: "sync", label: "Sync & Backup", icon: Cloud },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Export", icon: Download },
  ];

  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={userSettings.name}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                Profile Picture
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-full overflow-hidden">
                  {userSettings.avatar ? (
                    <img
                      src={userSettings.avatar}
                      alt={userSettings.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="space-x-2">
                  <Button variant="secondary" size="sm">
                    Change Photo
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <Button>Save Changes</Button>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Privacy & Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Login Sessions
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Manage your active sessions
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    View Sessions
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Data Encryption
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Your memories are encrypted at rest
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-success-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                AI Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      AI Features
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Enable AI-powered insights and summaries
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.preferences.aiEnabled}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            aiEnabled: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Auto-Tagging
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Automatically suggest tags for new memories
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Story Generation
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Allow AI to create stories from your memories
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "sync":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Sync & Backup
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Auto Backup
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Automatically backup your memories
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.preferences.autoBackup}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            autoBackup: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-neutral-900">
                      Storage Usage
                    </h3>
                    <span className="text-sm text-neutral-600">
                      2.4 GB of 15 GB used
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: "16%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Last Backup
                    </h3>
                    <p className="text-sm text-neutral-600">2 hours ago</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Backup Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Appearance
              </h2>
              <div className="space-y-4">
                <Select
                  label="Theme"
                  options={themeOptions}
                  value={userSettings.preferences.theme}
                  onChange={(value) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: value as any },
                    }))
                  }
                />

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Reduce Motion
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Data & Export
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Export All Data
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Download all your memories and data
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-destructive-200 rounded-lg bg-destructive-50">
                  <div>
                    <h3 className="font-medium text-destructive-900">
                      Delete Account
                    </h3>
                    <p className="text-sm text-destructive-700">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <main className="flex">
          <div className="p-6 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900">
                  Settings
                </h1>
                <p className="text-neutral-600 mt-1">
                  Manage your account, privacy, and preferences
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                  <Card className="p-4">
                    <nav className="space-y-1">
                      {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                              activeSection === section.id
                                ? "bg-primary-100 text-primary-900 border border-primary-200"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{section.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </Card>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                  <Card className="p-6">{renderSection()}</Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Account Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          console.log("Account deleted");
          setShowDeleteDialog(false);
        }}
        title="Delete Account"
        message="This will permanently delete your account and all your memories. This action cannot be undone."
        confirmLabel="Delete Account"
        variant="destructive"
      />
    </div>
  );
};

export default SettingsPage;
