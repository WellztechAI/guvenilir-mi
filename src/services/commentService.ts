import { api } from '@/lib/api';
import { Comment } from '@/types';

// ============================================
// API Response Types
// ============================================

interface ApiComment {
    id: string;
    author_id: string;
    author_name: string;
    author_avatar?: string;
    company_id: string;
    company_name: string;
    created_at: string;
    rating: number;
    status: string;
    message: string;
    answer?: string;
    answer_date?: string;
    likes_count: number;
    product_name?: string;
    contact_method?: string;
}

interface CommentsResponse {
    data: ApiComment[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        totalPages: number;
    };
}

export interface PaginationInfo {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
}

export interface PaginatedComments {
    comments: Comment[];
    pagination: PaginationInfo;
}

// ============================================
// Helper: Convert API response to Comment type
// ============================================

const apiCommentToComment = (apiComment: ApiComment): Comment => ({
    id: apiComment.id,
    authorId: apiComment.author_id,
    authorName: apiComment.author_name || 'Anonim',
    authorAvatar: apiComment.author_avatar,
    companyId: apiComment.company_id,
    companyName: apiComment.company_name || '',
    date: apiComment.created_at ? new Date(apiComment.created_at) : new Date(),
    rating: apiComment.rating || 0,
    status: apiComment.status || 'pending',
    message: apiComment.message || '',
    answer: apiComment.answer,
    answerDate: apiComment.answer_date ? new Date(apiComment.answer_date) : undefined,
    likesCount: apiComment.likes_count || 0,
    productName: apiComment.product_name,
    contactMethod: apiComment.contact_method,
});

// ============================================
// Comment CRUD Operations (using Backend API)
// ============================================

/**
 * Creates a new comment
 */
export const createComment = async (
    authorId: string,
    companyId: string,
    rating: number,
    message: string,
    productName?: string,
    contactMethod?: string
): Promise<string> => {
    try {
        const commentData = {
            companyId,
            authorId,
            message,
            rating,
            productName,
            contactMethod,
        };

        // Server returns { data: { id: ..., ... } }
        const response = await api.post<{ data: ApiComment }>('/api/comments', commentData);
        console.log('Comment created successfully with ID:', response.data.id);
        return response.data.id;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

/**
 * Fetches comments by company ID with optional filters
 */
export const fetchCommentsByCompanyId = async (
    companyId: string,
    options?: {
        status?: string;
        rating?: number;
        search?: string;
        sortBy?: 'created_at' | 'rating' | 'likes_count';
        sortOrder?: 'ASC' | 'DESC';
        limit?: number;
        offset?: number;
    }
): Promise<Comment[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.rating) params.append('rating', options.rating.toString());
        if (options?.search) params.append('search', options.search);
        if (options?.sortBy) params.append('sortBy', options.sortBy);
        if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        const url = `/api/companies/${companyId}/comments${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<CommentsResponse>(url);
        const comments = response.data || [];
        return comments.map(apiCommentToComment);
    } catch (error) {
        console.error('Error fetching comments by company ID:', error);
        return []; // Return empty array instead of throwing to prevent page crash
    }
};

/**
 * Fetches comments by company ID with pagination info
 * Returns both comments and pagination metadata for proper paginated display
 */
export const fetchCommentsByCompanyIdPaginated = async (
    companyId: string,
    options?: {
        status?: string;
        rating?: number;
        search?: string;
        sortBy?: 'created_at' | 'rating' | 'likes_count';
        sortOrder?: 'ASC' | 'DESC';
        limit?: number;
        page?: number;
    }
): Promise<PaginatedComments> => {
    try {
        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.rating) params.append('rating', options.rating.toString());
        if (options?.search) params.append('search', options.search);
        if (options?.sortBy) params.append('sortBy', options.sortBy);
        if (options?.sortOrder) params.append('sortOrder', options.sortOrder);

        const limit = options?.limit || 10;
        const page = options?.page || 1;
        const offset = (page - 1) * limit;

        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        const queryString = params.toString();
        const url = `/api/companies/${companyId}/comments${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<CommentsResponse>(url);
        const comments = (response.data || []).map(apiCommentToComment);

        return {
            comments,
            pagination: response.pagination || {
                total: comments.length,
                limit,
                offset,
                page,
                totalPages: 1,
            },
        };
    } catch (error) {
        console.error('Error fetching comments by company ID:', error);
        return {
            comments: [],
            pagination: {
                total: 0,
                limit: options?.limit || 10,
                offset: 0,
                page: 1,
                totalPages: 0,
            },
        };
    }
};

/**
 * Fetches comments by author ID
 */
export const fetchCommentsByAuthorId = async (
    authorId: string,
    options?: {
        limit?: number;
        offset?: number;
    }
): Promise<Comment[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        const url = `/api/users/${authorId}/comments${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<CommentsResponse>(url);
        const comments = response.data || [];
        return comments.map(apiCommentToComment);
    } catch (error) {
        console.error('Error fetching comments by author ID:', error);
        return []; // Return empty array instead of throwing
    }
};

/**
 * Fetches a single comment by ID
 */
export const fetchComment = async (commentId: string): Promise<Comment | null> => {
    try {
        const response = await api.get<ApiComment>(`/api/comments/${commentId}`);
        return apiCommentToComment(response);
    } catch (error: any) {
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            return null;
        }
        console.error('Error fetching comment:', error);
        throw error;
    }
};

/**
 * Updates a comment
 */
export const updateComment = async (
    commentId: string,
    updates: {
        message?: string;
        rating?: number;
        productName?: string;
        contactMethod?: string;
    }
): Promise<void> => {
    try {
        await api.put(`/api/comments/${commentId}`, updates);
        console.log('Comment updated:', commentId);
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

/**
 * Updates comment status (approve/reject)
 */
export const updateCommentStatus = async (
    commentId: string,
    status: 'pending' | 'approved' | 'rejected' | 'deleted'
): Promise<void> => {
    try {
        await api.patch(`/api/comments/${commentId}/status`, { status });
        console.log('Comment status updated:', commentId, status);
    } catch (error) {
        console.error('Error updating comment status:', error);
        throw error;
    }
};

/**
 * Adds an answer to a comment
 */
export const answerComment = async (commentId: string, answer: string): Promise<void> => {
    try {
        await api.patch(`/api/comments/${commentId}/answer`, { answer });
        console.log('Comment answered:', commentId);
    } catch (error) {
        console.error('Error answering comment:', error);
        throw error;
    }
};

/**
 * Likes a comment
 * POST /api/comments/:commentId/like
 */
export const likeComment = async (commentId: string, userId: string): Promise<{ liked: boolean }> => {
    try {
        const response = await api.post<{ data: ApiComment; liked: boolean }>(
            `/api/comments/${commentId}/like`,
            { userId }
        );
        console.log('Comment liked:', commentId);
        return { liked: response.liked };
    } catch (error: any) {
        // 409 means already liked
        if (error.message?.includes('409')) {
            return { liked: true };
        }
        console.error('Error liking comment:', error);
        throw error;
    }
};

/**
 * Unlikes a comment
 * DELETE /api/comments/:commentId/like
 */
export const unlikeComment = async (commentId: string, userId: string): Promise<{ liked: boolean }> => {
    try {
        const response = await api.delete<{ data: ApiComment; liked: boolean }>(
            `/api/comments/${commentId}/like`,
            { userId }
        );
        console.log('Comment unliked:', commentId);
        return { liked: response.liked };
    } catch (error: any) {
        // 400 means wasn't liked
        if (error.message?.includes('400')) {
            return { liked: false };
        }
        console.error('Error unliking comment:', error);
        throw error;
    }
};

/**
 * Checks if a user has liked a comment
 * GET /api/comments/:commentId/like/:userId
 */
export const checkUserLike = async (
    commentId: string,
    userId: string
): Promise<{ liked: boolean; likedAt?: Date }> => {
    try {
        const response = await api.get<{ liked: boolean; likedAt?: string }>(
            `/api/comments/${commentId}/like/${userId}`
        );
        return {
            liked: response.liked,
            likedAt: response.likedAt ? new Date(response.likedAt) : undefined,
        };
    } catch (error) {
        console.error('Error checking user like:', error);
        return { liked: false };
    }
};

/**
 * Toggles like status on a comment
 * Convenience function that likes or unlikes based on current state
 */
export const toggleCommentLike = async (
    commentId: string,
    userId: string
): Promise<{ liked: boolean }> => {
    const { liked } = await checkUserLike(commentId, userId);
    if (liked) {
        return unlikeComment(commentId, userId);
    } else {
        return likeComment(commentId, userId);
    }
};

/**
 * Searches comments
 */
export const searchComments = async (
    searchTerm: string,
    options?: {
        companySlug?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }
): Promise<Comment[]> => {
    try {
        const params = new URLSearchParams();
        params.append('q', searchTerm);
        if (options?.companySlug) params.append('companySlug', options.companySlug);
        if (options?.status) params.append('status', options.status);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const response = await api.get<CommentsResponse>(`/api/search/comments?${params.toString()}`);
        return response.data.map(apiCommentToComment);
    } catch (error) {
        console.error('Error searching comments:', error);
        throw error;
    }
};
