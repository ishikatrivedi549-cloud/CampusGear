export type ExchangeMode = "SELL" | "LEND" | "DONATE";
export type ConditionType = "NEW" | "LIKE_NEW" | "GOOD" | "USABLE";
export type ListingStatus = "AVAILABLE" | "RESERVED" | "LENT" | "COMPLETED" | "ARCHIVED";
export type ExchangeStatus =
  | "REQUESTED"
  | "APPROVED"
  | "PICKED_UP"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  branch: string;
  currentSemester: number;
  isVerified: boolean;
  ratingAvg: number;
  ratingCount: number;
  completedExchanges: number;
  estimatedSavingsInr: number;
  role: "STUDENT" | "ADMIN";
  avatarUrl?: string | null;
}

export interface PickupSlot {
  id: string;
  listingId: string;
  locationName: string;
  timeWindow: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  branch: string;
  semester: number;
  subjectName: string;
  subjectCode: string;
  isbn?: string | null;
  edition?: string | null;
  condition: ConditionType;
  exchangeMode: ExchangeMode;
  priceInr: number;
  lendDurationDays?: number | null;
  lendRateText?: string | null;
  depositInr?: number | null;
  imageUrl?: string | null;
  status: ListingStatus;
  reservedUntil?: string | Date | null;
  lentUntil?: string | Date | null;
  ownerId: string;
  createdAt: string | Date;
  owner?: User;
  pickupSlots?: PickupSlot[];
  exchanges?: Exchange[];
}

export interface Exchange {
  id: string;
  listingId: string;
  borrowerId: string;
  lenderId: string;
  exchangeMode: ExchangeMode;
  status: ExchangeStatus;
  pickupLocation: string;
  pickupTimeWindow: string;
  intendedReturnDate?: string | Date | null;
  holdExpiresAt?: string | Date | null;
  borrowerNote?: string | null;

  // Handover confirmation
  lenderConfirmedHandover: boolean;
  borrowerConfirmedHandover: boolean;
  conditionChecklistLender: boolean;
  conditionChecklistBorrower: boolean;
  handoverCompletedAt?: string | Date | null;

  // Return confirmation
  lenderConfirmedReturn: boolean;
  borrowerConfirmedReturn: boolean;
  returnCompletedAt?: string | Date | null;

  createdAt: string | Date;
  updatedAt: string | Date;

  listing?: Listing;
  borrower?: User;
  lender?: User;
  ratings?: Rating[];
}

export interface Rating {
  id: string;
  exchangeId: string;
  raterId: string;
  targetUserId: string;
  score: number;
  comment: string;
  createdAt: string | Date;
  rater?: User;
}

export interface PickupLocation {
  id: string;
  name: string;
  landmark: string;
  isSafeSpot: boolean;
}
