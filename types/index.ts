export type UserRole = "customer" | "business";

export interface User {
  id: string;
  role: UserRole;
  phoneNumber: string;
  name?: string;
  points: number;
  checkIns: CheckIn[];
  rewards: Reward[];
  referrals: string[];
  streakDays: number;
  lastCheckIn: string | null;
}

export interface Business {
  id: string;
  name: string;
  phoneNumber: string;
  category: string;
  loyaltyProgram: LoyaltyProgram;
  customers: string[];
  checkIns: CheckIn[];
}

export interface LoyaltyProgram {
  pointsPerVisit: number;
  streakBonus: number;
  rewards: Reward[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  claimed: boolean;
  claimedAt?: string;
}

export interface CheckIn {
  id: string;
  businessId: string;
  userId: string;
  timestamp: string;
  points: number;
  method: "wifi" | "qr" | "nfc";
  synced: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}
