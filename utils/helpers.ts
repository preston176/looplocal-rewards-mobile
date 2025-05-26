export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return regex.test(phoneNumber);
};

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getPointsToNextReward = (
  currentPoints: number,
  rewards: any[]
): number => {
  if (!rewards.length) return 0;

  const sortedRewards = [...rewards].sort(
    (a, b) => a.pointsRequired - b.pointsRequired
  );

  for (const reward of sortedRewards) {
    if (reward.pointsRequired > currentPoints) {
      return reward.pointsRequired - currentPoints;
    }
  }

  return 0;
};

export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays <= 1) return 0;
  if (streakDays <= 3) return 5;
  if (streakDays <= 7) return 10;
  return 15;
};
