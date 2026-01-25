import { api } from '@/lib/api';
import { User, Noti, Reward } from '@/types';

// ============================================
// API Response Types
// ============================================

interface ApiUser {
    id: string;
    user_name: string;
    email: string;
    phone_number?: string;
    country?: string;
    image_url?: string;
    status: string;
    created_at: string;
}

interface ApiNotification {
    id: string;
    user_id: string;
    text: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

interface ApiReward {
    id: string;
    user_id: string;
    text: string;
    code: string;
    is_used: boolean;
    created_at: string;
}

interface NotificationsResponse {
    data: ApiNotification[];
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        totalPages: number;
    };
}

interface RewardsResponse {
    data: ApiReward[];
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        totalPages: number;
    };
}

interface UsersResponse {
    data: ApiUser[];
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        totalPages: number;
    };
}

// ============================================
// Helper: Convert API response to types
// ============================================

const apiNotificationToNoti = (apiNoti: ApiNotification): Noti => ({
    id: apiNoti.id,
    date: new Date(apiNoti.created_at),
    text: apiNoti.text,
    isRead: apiNoti.is_read,
    type: apiNoti.type,
});

const apiRewardToReward = (apiReward: ApiReward): Reward => ({
    id: apiReward.id,
    date: new Date(apiReward.created_at),
    text: apiReward.text,
    code: apiReward.code,
    isUsed: apiReward.is_used,
});

const apiUserToUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    userName: apiUser.user_name,
    email: apiUser.email,
    phoneNumber: apiUser.phone_number,
    country: apiUser.country,
    imageUrl: apiUser.image_url,
    status: apiUser.status,
    createdAt: new Date(apiUser.created_at),
    favouriteCompanies: [],
});

// ============================================
// User Profile Operations
// ============================================

/**
 * Updates user profile
 * PUT /api/users/:userId
 */
export const updateUserProfile = async (
    userId: string,
    updates: {
        userName?: string;
        phoneNumber?: string;
        country?: string;
        imageUrl?: string;
        status?: string;
    }
): Promise<void> => {
    try {
        await api.put(`/api/users/${userId}`, updates);
        console.log('User profile updated:', userId);
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Updates user avatar
 * PUT /api/users/:userId
 */
export const updateUserAvatar = async (userId: string, imageUrl: string): Promise<void> => {
    return updateUserProfile(userId, { imageUrl });
};

// ============================================
// Notification Operations
// ============================================

/**
 * Fetches user notifications
 * GET /api/users/:userId/notifications
 */
export const fetchNotificationsByUserId = async (
    userId: string,
    options?: {
        unreadOnly?: boolean;
        limit?: number;
        offset?: number;
    }
): Promise<Noti[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.unreadOnly) params.append('unreadOnly', 'true');
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        const url = `/api/users/${userId}/notifications${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<NotificationsResponse>(url);
        return (response.data || []).map(apiNotificationToNoti);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

/**
 * Fetches unread notifications count
 */
export const fetchUnreadNotificationsCount = async (userId: string): Promise<number> => {
    try {
        const notifications = await fetchNotificationsByUserId(userId, { unreadOnly: true });
        return notifications.length;
    } catch (error) {
        console.error('Error fetching unread notifications count:', error);
        return 0;
    }
};

/**
 * Marks notifications as read
 * PATCH /api/users/:userId/notifications/read
 */
export const markNotificationsAsRead = async (
    userId: string,
    notificationIds?: string[]
): Promise<void> => {
    try {
        const body = notificationIds ? { notificationIds } : {};
        await api.patch(`/api/users/${userId}/notifications/read`, body);
        console.log('Notifications marked as read');
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        throw error;
    }
};

/**
 * Marks a single notification as read
 */
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
    return markNotificationsAsRead(userId, [notificationId]);
};

/**
 * Marks all notifications as read
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    return markNotificationsAsRead(userId);
};

// ============================================
// Reward Operations
// ============================================

/**
 * Fetches user rewards
 * GET /api/users/:userId/rewards
 */
export const fetchRewardsByUserId = async (
    userId: string,
    options?: {
        unusedOnly?: boolean;
        limit?: number;
        offset?: number;
    }
): Promise<Reward[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.unusedOnly) params.append('unusedOnly', 'true');
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        const url = `/api/users/${userId}/rewards${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<RewardsResponse>(url);
        return (response.data || []).map(apiRewardToReward);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        return [];
    }
};

/**
 * Fetches unused rewards
 */
export const fetchUnusedRewards = async (userId: string): Promise<Reward[]> => {
    return fetchRewardsByUserId(userId, { unusedOnly: true });
};

// ============================================
// Admin User Operations
// ============================================

/**
 * Fetches all users (admin)
 * GET /api/users
 */
export const fetchAllUsers = async (options?: {
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<User[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        const url = `/api/users${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<UsersResponse>(url);
        return (response.data || []).map(apiUserToUser);
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};
