// ============================================
// User Types
// ============================================

export interface FavouriteCompany {
    id: string;
    name: string;
    slug: string;
    image_url: string;
}

export interface User {
    id: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    favouriteCompanies: FavouriteCompany[];
    createdAt: Date | string;
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
    signatureUrls: string[];
    address: string;
    city: string;
    district: string;
    postalCode: string;
    membership: string;
    status: string;
    rejectionReason?: string;
    createdAt: Date;
}

