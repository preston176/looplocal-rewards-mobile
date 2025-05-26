import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole } from "@/types";
import { generateId } from "@/utils/helpers";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  tempPhoneNumber: string | null;
  setTempPhoneNumber: (phoneNumber: string) => void;
  setRole: (role: UserRole) => void;
  createUser: (phoneNumber: string, role: UserRole, name?: string) => void;
  logout: () => void;
  addPoints: (points: number) => void;
  addCheckIn: (checkIn: any) => void;
  updateStreak: () => void;
  addReferral: (referralId: string) => void;
  claimReward: (rewardId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarding: false,
      tempPhoneNumber: null,

      setTempPhoneNumber: (phoneNumber) =>
        set({ tempPhoneNumber: phoneNumber }),

      setRole: (role) => {
        const tempPhoneNumber = get().tempPhoneNumber;
        if (tempPhoneNumber) {
          set({ isOnboarding: true });
        }
      },

      createUser: (phoneNumber, role, name) => {
        const newUser: User = {
          id: generateId(),
          role,
          phoneNumber,
          name: name || "",
          points: 0,
          checkIns: [],
          rewards: [],
          referrals: [],
          streakDays: 0,
          lastCheckIn: null,
        };

        set({
          user: newUser,
          isAuthenticated: true,
          isOnboarding: false,
          tempPhoneNumber: null,
        });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      addPoints: (points) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, points: user.points + points } });
        }
      },

      addCheckIn: (checkIn) => {
        const user = get().user;
        if (user) {
          const updatedCheckIns = [...user.checkIns, checkIn];
          set({
            user: {
              ...user,
              checkIns: updatedCheckIns,
              lastCheckIn: new Date().toISOString(),
            },
          });
        }
      },

      updateStreak: () => {
        const user = get().user;
        if (user) {
          const lastCheckIn = user.lastCheckIn
            ? new Date(user.lastCheckIn)
            : null;
          const today = new Date();

          // If last check-in was yesterday, increment streak
          if (lastCheckIn) {
            const diffTime = Math.abs(today.getTime() - lastCheckIn.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              set({ user: { ...user, streakDays: user.streakDays + 1 } });
            } else if (diffDays > 1) {
              // Reset streak if more than a day has passed
              set({ user: { ...user, streakDays: 1 } });
            }
          } else {
            // First check-in
            set({ user: { ...user, streakDays: 1 } });
          }
        }
      },

      addReferral: (referralId) => {
        const user = get().user;
        if (user && !user.referrals.includes(referralId)) {
          set({
            user: {
              ...user,
              referrals: [...user.referrals, referralId],
              points: user.points + 10, // Bonus points for referral
            },
          });
        }
      },

      claimReward: (rewardId) => {
        const user = get().user;
        if (user) {
          const updatedRewards = user.rewards.map((reward) =>
            reward.id === rewardId
              ? {
                  ...reward,
                  claimed: true,
                  claimedAt: new Date().toISOString(),
                }
              : reward
          );

          set({ user: { ...user, rewards: updatedRewards } });
        }
      },
    }),
    {
      name: "loop-local-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
