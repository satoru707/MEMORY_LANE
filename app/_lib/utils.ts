import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Memory } from "@/types/types";
import { useState, useEffect } from "react";
import Dexie, { Table } from "dexie";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

//check if online or offline
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);
    console.log("Kinda confused", navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export interface OfflineChange {
  id?: number;
  type: "add" | "update" | "delete";
  collection: string;
  data: Memory; // Or a more generic type if you handle other data types
  timestamp: number;
}

export class MemoryLaneDexie extends Dexie {
  memories!: Table<Memory, string>;
  offline_changes!: Table<OfflineChange, number>;

  constructor() {
    super("MemoryLaneDatabase");
    this.version(1).stores({
      memories:
        "id, title, content, summary, date, mood, tags, images, location, isAiGenerated, syncStatus, createdAt, updatedAt, isPublic, userId",
      offline_changes: "++id, type, collection, timestamp",
    });
  }
}

export const db = new MemoryLaneDexie();
