import { api } from '@/lib/api';
import { CompanyVerification, Comment } from '@/types';

// ============================================
// API Response Types
// ============================================

interface ApiVerification {
    id: string;
    company_id: string;
    requester_name: string;
    requester_title: string;
    requester_company_email: string;
    requester_phone_number?: string;
    panel_user_name: string;
    mernis_no: string;
    signature_urls: string[];
    address: string;
    city: string;
    district: string;
    postal_code: string;
    membership: string;
    status: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
}

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

interface VerificationsResponse {
    data: ApiVerification[];
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        totalPages: number;
    };
}

interface CommentsResponse {
    data: ApiComment[];
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

const apiVerificationToVerification = (apiVerification: ApiVerification): CompanyVerification => ({
    id: apiVerification.id,
    companyId: apiVerification.company_id,
    requesterName: apiVerification.requester_name,
    requesterTitle: apiVerification.requester_title,
    requesterCompanyEmail: apiVerification.requester_company_email,
    requesterPhoneNumber: apiVerification.requester_phone_number,
    panelUserName: apiVerification.panel_user_name,
    mernisNo: apiVerification.mernis_no,
    signatureUrls: apiVerification.signature_urls || [],
    address: apiVerification.address,
    city: apiVerification.city,
    district: apiVerification.district,
    postalCode: apiVerification.postal_code,
    membership: apiVerification.membership,
    status: apiVerification.status,
    rejectionReason: apiVerification.rejection_reason,
    createdAt: new Date(apiVerification.created_at),
});

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
// Company Verification Functions
// ============================================

/**
 * Fetches all company verifications with optional status filter
 */
export const fetchAllCompanyVerifications = async (
    status?: 'pending' | 'approved' | 'rejected' | 'all'
): Promise<CompanyVerification[]> => {
    try {
        const params = new URLSearchParams();
        if (status && status !== 'all') {
            params.append('status', status);
        } else {
            params.append('status', 'all');
        }
        params.append('limit', '100');

        const response = await api.get<VerificationsResponse>(`/api/verifications?${params.toString()}`);
        return (response.data || []).map(apiVerificationToVerification);
    } catch (error) {
        console.error('Error fetching all company verifications:', error);
        throw error;
    }
};

/**
 * Approves a company verification
 */
export const approveVerification = async (verificationId: string): Promise<void> => {
    try {
        await api.post(`/api/verifications/${verificationId}/approve`);
        console.log('✅ Verification approved:', verificationId);
    } catch (error) {
        console.error('Error approving verification:', error);
        throw error;
    }
};

/**
 * Rejects a company verification
 */
export const rejectVerification = async (verificationId: string, reason?: string): Promise<void> => {
    try {
        await api.post(`/api/verifications/${verificationId}/reject`, { reason });
        console.log('✅ Verification rejected:', verificationId);
    } catch (error) {
        console.error('Error rejecting verification:', error);
        throw error;
    }
};

/**
 * Updates the status of a company verification (legacy - for backward compatibility)
 */
export const updateVerificationStatus = async (
    id: string,
    status: 'approved' | 'rejected' | 'pending'
): Promise<void> => {
    if (status === 'approved') {
        await approveVerification(id);
    } else if (status === 'rejected') {
        await rejectVerification(id);
    }
};

// ============================================
// Comment Moderation Functions
// ============================================

/**
 * Fetches all comments with optional status filter (for admin moderation)
 */
export const fetchAllPendingComments = async (): Promise<Comment[]> => {
    try {
        const response = await api.get<CommentsResponse>('/api/admin/comments?status=pending&limit=100');
        return (response.data || []).map(apiCommentToComment);
    } catch (error) {
        console.error('Error fetching pending comments:', error);
        return [];
    }
};

/**
 * Fetches comments by status for admin moderation
 */
export const fetchCommentsByStatus = async (
    status: 'pending' | 'approved' | 'rejected' | 'all',
    limit: number = 50
): Promise<Comment[]> => {
    try {
        const params = new URLSearchParams();
        if (status !== 'all') {
            params.append('status', status);
        }
        params.append('limit', limit.toString());

        const response = await api.get<CommentsResponse>(`/api/admin/comments?${params.toString()}`);
        return (response.data || []).map(apiCommentToComment);
    } catch (error) {
        console.error('Error fetching comments by status:', error);
        return [];
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
        console.log('✅ Comment status updated:', commentId, status);
    } catch (error) {
        console.error('Error updating comment status:', error);
        throw error;
    }
};

/**
 * Approves a comment
 */
export const approveComment = async (commentId: string): Promise<void> => {
    await updateCommentStatus(commentId, 'approved');
};

/**
 * Rejects a comment
 */
export const rejectComment = async (commentId: string): Promise<void> => {
    await updateCommentStatus(commentId, 'rejected');
};

/**
 * Deletes a comment (soft delete)
 */
export const deleteComment = async (commentId: string): Promise<void> => {
    await updateCommentStatus(commentId, 'deleted');
};
