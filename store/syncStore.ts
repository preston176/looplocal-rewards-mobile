import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckIn } from "@/types";

interface SyncState {
  pendingCheckIns: CheckIn[];
  isOnline: boolean;
  lastSyncTime: string | null;
  addPendingCheckIn: (checkIn: CheckIn) => void;
  markAsSynced: (checkInId: string) => void;
  syncAll: () => void;
  setOnlineStatus: (status: boolean) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      pendingCheckIns: [],
      isOnline: true,
      lastSyncTime: null,

      addPendingCheckIn: (checkIn) => {
        set((state) => ({
          pendingCheckIns: [
            ...state.pendingCheckIns,
            { ...checkIn, synced: false },
          ],
        }));
      },

      markAsSynced: (checkInId) => {
        set((state) => ({
          pendingCheckIns: state.pendingCheckIns.filter(
            (c) => c.id !== checkInId
          ),
          lastSyncTime: new Date().toISOString(),
        }));
      },

      syncAll: () => {
        // In a real app, this would make API calls to sync data
        // For our prototype, we'll just mark everything as synced
        set((state) => ({
          pendingCheckIns: [],
          lastSyncTime: new Date().toISOString(),
        }));
      },

      setOnlineStatus: (status) => {
        set({ isOnline: status });

        // If coming back online, attempt to sync
        if (status && get().pendingCheckIns.length > 0) {
          get().syncAll();
        }
      },
    }),
    {
      name: "loop-local-sync",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
