// ============================================
// User Types
// ============================================

export interface User {
    id: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    favouriteCompanies: string[];
    createdAt: Date;
    country?: string;
    imageUrl?: string;
    status: string;
}

// ============================================
// Notification Types
// ============================================

export interface Noti {
    id: string;
    date: Date;
    text: string;
    isRead: boolean;
    type: string;
}

// ============================================
// Reward Types
// ============================================

export interface Reward {
    id: string;
    date: Date;
    text: string;
    code: string;
    isUsed: boolean;
}

// ============================================
// Company Types
// ============================================

export interface Company {
    id: string;
    name: string;
    description: string;
    rating: number | null;
    commentCount: number;
    imageUrl?: string;
    phone: string;
    sectors: string[];
    status: string;
}

// ============================================
// Comment Types
// ============================================

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    companyId: string;
    companyName: string;
    date: Date;
    rating: number;
    status: string;
    message: string;
    answer?: string;
    answerDate?: Date;
    likesCount: number;
    productName?: string;
    contactMethod?: string;
}

// ============================================
// Company Verification Types
// ============================================

export interface CompanyVerification {
    id: string;
    companyId: string;
    requesterName: string;
    requesterTitle: string;
    requesterCompanyEmail: string;
    requesterPhoneNumber?: string;
    panelUserName: string;
    mernisNo: string;
    signatureUrls: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    membership: string;
    status: string;
    createdAt: Date;
}

// ============================================
// Firebase/Firestore Compatible Types
// ============================================

import { Timestamp } from 'firebase/firestore';

export interface UserFirestore extends Omit<User, 'createdAt'> {
    createdAt: Timestamp;
}

export interface NotiFirestore extends Omit<Noti, 'date'> {
    date: Timestamp;
}

export interface RewardFirestore extends Omit<Reward, 'date'> {
    date: Timestamp;
}

export interface CommentFirestore extends Omit<Comment, 'date' | 'answerDate'> {
    date: Timestamp;
    answerDate?: Timestamp;
}

// ============================================
// Type Converters
// ============================================

export const convertTimestampToDate = (timestamp: Timestamp): Date => {
    return timestamp.toDate();
};

export const convertDateToTimestamp = (date: Date): Timestamp => {
    return Timestamp.fromDate(date);
};

export const userFromFirestore = (data: UserFirestore): User => ({
    ...data,
    createdAt: convertTimestampToDate(data.createdAt),
});

// Helper to convert undefined values to null (Firestore doesn't accept undefined)
const convertUndefinedToNull = <T extends Record<string, unknown>>(obj: T): T => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, value === undefined ? null : value])
    ) as T;
};

export const userToFirestore = (data: User): UserFirestore => {
    const firestoreData = {
        ...data,
        createdAt: convertDateToTimestamp(data.createdAt),
    };
    return convertUndefinedToNull(firestoreData);
};

export const notiFromFirestore = (data: NotiFirestore): Noti => ({
    ...data,
    date: convertTimestampToDate(data.date),
});

export const notiToFirestore = (data: Noti): NotiFirestore => ({
    ...data,
    date: convertDateToTimestamp(data.date),
});

export const rewardFromFirestore = (data: RewardFirestore): Reward => ({
    ...data,
    date: convertTimestampToDate(data.date),
});

export const rewardToFirestore = (data: Reward): RewardFirestore => ({
    ...data,
    date: convertDateToTimestamp(data.date),
});

export const commentFromFirestore = (data: CommentFirestore): Comment => ({
    ...data,
    date: convertTimestampToDate(data.date),
    answerDate: data.answerDate ? convertTimestampToDate(data.answerDate) : undefined,
});

export const commentToFirestore = (data: Comment): CommentFirestore => ({
    ...data,
    date: convertDateToTimestamp(data.date),
    answerDate: data.answerDate ? convertDateToTimestamp(data.answerDate) : undefined,
});
