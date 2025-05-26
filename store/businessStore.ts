import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Business, CheckIn, LoyaltyProgram, Reward } from "@/types";
import { generateId } from "@/utils/helpers";

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  createBusiness: (name: string, phoneNumber: string, category: string) => void;
  updateLoyaltyProgram: (loyaltyProgram: LoyaltyProgram) => void;
  addCustomer: (customerId: string) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  addReward: (reward: Reward) => void;
  getBusinessById: (id: string) => Business | undefined;
  getCheckInsForPeriod: (period: "day" | "week" | "month") => CheckIn[];
  getTopCustomers: () => { id: string; checkIns: number }[];
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      businesses: [],
      currentBusiness: null,

      createBusiness: (name, phoneNumber, category) => {
        const newBusiness: Business = {
          id: generateId(),
          name,
          phoneNumber,
          category,
          loyaltyProgram: {
            pointsPerVisit: 10,
            streakBonus: 5,
            rewards: [],
          },
          customers: [],
          checkIns: [],
        };

        set((state) => ({
          businesses: [...state.businesses, newBusiness],
          currentBusiness: newBusiness,
        }));
      },

      updateLoyaltyProgram: (loyaltyProgram) => {
        const { currentBusiness } = get();
        if (currentBusiness) {
          const updatedBusiness = {
            ...currentBusiness,
            loyaltyProgram,
          };

          set((state) => ({
            currentBusiness: updatedBusiness,
            businesses: state.businesses.map((b) =>
              b.id === currentBusiness.id ? updatedBusiness : b
            ),
          }));
        }
      },

      addCustomer: (customerId) => {
        const { currentBusiness } = get();
        if (
          currentBusiness &&
          !currentBusiness.customers.includes(customerId)
        ) {
          const updatedBusiness = {
            ...currentBusiness,
            customers: [...currentBusiness.customers, customerId],
          };

          set((state) => ({
            currentBusiness: updatedBusiness,
            businesses: state.businesses.map((b) =>
              b.id === currentBusiness.id ? updatedBusiness : b
            ),
          }));
        }
      },

      addCheckIn: (checkIn) => {
        const { currentBusiness } = get();
        if (currentBusiness) {
          const updatedBusiness = {
            ...currentBusiness,
            checkIns: [...currentBusiness.checkIns, checkIn],
          };

          set((state) => ({
            currentBusiness: updatedBusiness,
            businesses: state.businesses.map((b) =>
              b.id === currentBusiness.id ? updatedBusiness : b
            ),
          }));
        }
      },

      addReward: (reward) => {
        const { currentBusiness } = get();
        if (currentBusiness) {
          const updatedLoyaltyProgram = {
            ...currentBusiness.loyaltyProgram,
            rewards: [...currentBusiness.loyaltyProgram.rewards, reward],
          };

          const updatedBusiness = {
            ...currentBusiness,
            loyaltyProgram: updatedLoyaltyProgram,
          };

          set((state) => ({
            currentBusiness: updatedBusiness,
            businesses: state.businesses.map((b) =>
              b.id === currentBusiness.id ? updatedBusiness : b
            ),
          }));
        }
      },

      getBusinessById: (id) => {
        return get().businesses.find((b) => b.id === id);
      },

      getCheckInsForPeriod: (period) => {
        const { currentBusiness } = get();
        if (!currentBusiness) return [];

        const now = new Date();
        let startDate = new Date();

        switch (period) {
          case "day":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
        }

        return currentBusiness.checkIns.filter((checkIn) => {
          const checkInDate = new Date(checkIn.timestamp);
          return checkInDate >= startDate && checkInDate <= now;
        });
      },

      getTopCustomers: () => {
        const { currentBusiness } = get();
        if (!currentBusiness) return [];

        const customerCheckIns: Record<string, number> = {};

        currentBusiness.checkIns.forEach((checkIn) => {
          if (customerCheckIns[checkIn.userId]) {
            customerCheckIns[checkIn.userId]++;
          } else {
            customerCheckIns[checkIn.userId] = 1;
          }
        });

        return Object.entries(customerCheckIns)
          .map(([id, checkIns]) => ({ id, checkIns }))
          .sort((a, b) => b.checkIns - a.checkIns)
          .slice(0, 10);
      },
    }),
    {
      name: "loop-local-business",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
