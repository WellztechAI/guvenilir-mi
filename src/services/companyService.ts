import { api } from '@/lib/api';
import { Company } from '@/types';

// ============================================
// API Response Types
// ============================================

interface ApiCompany {
    id: string;
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    image_url?: string;
    status: string;
    rating: number | null;
    comment_count: number;
    sectors?: string[];
    created_at: string;
}

interface SearchResponse {
    data: ApiCompany[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        page: number;
        totalPages: number;
    };
}

interface SuggestResponse {
    suggestions: Array<{
        id: string;
        name: string;
        slug: string;
        rating: number | null;
    }>;
}

// ============================================
// Helper: Convert API response to Company type
// ============================================

const apiCompanyToCompany = (apiCompany: ApiCompany): Company => ({
    id: apiCompany.id,
    name: apiCompany.name,
    description: apiCompany.description || '',
    rating: apiCompany.rating,
    commentCount: apiCompany.comment_count,
    imageUrl: apiCompany.image_url,
    phone: apiCompany.phone || '',
    sectors: apiCompany.sectors || [],
    status: apiCompany.status,
});

// ============================================
// Company CRUD Operations (using Backend API)
// ============================================

/**
 * Fetches a company by ID
 */
export const fetchCompany = async (companyId: string): Promise<Company | null> => {
    try {
        const response = await api.get<{ data: ApiCompany }>(`/api/companies/id/${companyId}`);
        return apiCompanyToCompany(response.data);
    } catch (error: any) {
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            console.log('No company found with ID:', companyId);
            return null;
        }
        console.error('Error fetching company:', error);
        throw error;
    }
};

/**
 * Fetches a company by slug
 */
export const fetchCompanyBySlug = async (slug: string): Promise<Company | null> => {
    try {
        const response = await api.get<{ data: ApiCompany }>(`/api/companies/${slug}`);
        return apiCompanyToCompany(response.data);
    } catch (error: any) {
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            console.log('No company found with slug:', slug);
            return null;
        }
        console.error('Error fetching company by slug:', error);
        throw error;
    }
};

/**
 * Fetches all companies
 */
export const fetchAllCompanies = async (options?: {
    status?: string;
    sector?: string;
    sort?: string;
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}): Promise<Company[]> => {
    try {
        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.sector) params.append('sector', options.sector);
        if (options?.sort) params.append('sort', options.sort);
        if (options?.order) params.append('order', options.order);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        const url = `/api/companies${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<{ data: ApiCompany[]; pagination: any }>(url);
        return response.data.map(apiCompanyToCompany);
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

/**
 * Fetches companies by status
 */
export const fetchCompaniesByStatus = async (status: string): Promise<Company[]> => {
    return fetchAllCompanies({ status });
};

/**
 * Fetches companies by sector
 */
export const fetchCompaniesBySector = async (sector: string): Promise<Company[]> => {
    return fetchAllCompanies({ sector });
};

/**
 * Fetches top-rated companies
 */
export const fetchTopRatedCompanies = async (limitCount: number = 10): Promise<Company[]> => {
    return fetchAllCompanies({
        status: 'active',
        sort: 'rating',
        order: 'DESC',
        limit: limitCount,
    });
};

// ============================================
// Search Functions (using Backend API)
// ============================================

/**
 * Searches companies by name using the backend search API
 */
export const searchCompaniesByName = async (searchTerm: string, options?: {
    sector?: string;
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<Company[]> => {
    try {
        if (!searchTerm || searchTerm.trim().length < 1) {
            return [];
        }

        const params = new URLSearchParams();
        params.append('q', searchTerm.trim());
        if (options?.sector) params.append('sector', options.sector);
        if (options?.status) params.append('status', options.status);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const response = await api.get<SearchResponse>(`/api/search/companies?${params.toString()}`);
        return response.data.map(apiCompanyToCompany);
    } catch (error) {
        console.error('Error searching companies:', error);
        throw error;
    }
};

/**
 * Gets autocomplete suggestions for company search
 */
export const getCompanySuggestions = async (query: string): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    rating: number | null;
}>> => {
    try {
        if (!query || query.trim().length < 1) {
            return [];
        }

        const response = await api.get<SuggestResponse>(`/api/search/suggest?q=${encodeURIComponent(query.trim())}`);
        return response.suggestions || [];
    } catch (error) {
        console.error('Error getting company suggestions:', error);
        return [];
    }
};

// ============================================
// Company Update Operations (using Backend API)
// ============================================

/**
 * Updates a company
 */
export const updateCompany = async (
    companyId: string,
    updates: Partial<Omit<Company, 'id'>>
): Promise<void> => {
    try {
        await api.put(`/api/companies/${companyId}`, updates);
        console.log('Company updated:', companyId);
    } catch (error) {
        console.error('Error updating company:', error);
        throw error;
    }
};

/**
 * Updates company rating
 */
export const updateCompanyRating = async (companyId: string, newRating: number): Promise<void> => {
    try {
        await api.put(`/api/companies/${companyId}`, { rating: newRating });
        console.log('Company rating updated:', companyId, newRating);
    } catch (error) {
        console.error('Error updating company rating:', error);
        throw error;
    }
};

/**
 * Updates company status
 */
export const updateCompanyStatus = async (companyId: string, status: string): Promise<void> => {
    try {
        await api.put(`/api/companies/${companyId}`, { status });
        console.log('Company status updated:', companyId, status);
    } catch (error) {
        console.error('Error updating company status:', error);
        throw error;
    }
};

// ============================================
// Helper Functions
// ============================================

/**
 * Fetches multiple companies by their IDs
 */
export const fetchCompaniesByIds = async (companyIds: string[]): Promise<Company[]> => {
    try {
        if (companyIds.length === 0) {
            return [];
        }

        const companies: Company[] = [];

        // Fetch each company individually (could be optimized with batch endpoint)
        for (const companyId of companyIds) {
            const company = await fetchCompany(companyId);
            if (company) {
                companies.push(company);
            }
        }

        return companies;
    } catch (error) {
        console.error('Error fetching companies by IDs:', error);
        throw error;
    }
};

/**
 * Creates a default company object
 */
export const createDefaultCompany = (
    name: string,
    description: string = '',
    sectors: string[] = []
): Omit<Company, 'id'> => {
    return {
        name,
        description,
        rating: null,
        commentCount: 0,
        imageUrl: undefined,
        phone: '',
        sectors,
        status: 'pending',
    };
};

// ============================================
// Global Search (Companies + Comments)
// ============================================

interface GlobalSearchResponse {
    companies: ApiCompany[];
    comments: Array<{
        id: string;
        author_id: string;
        author_name: string;
        company_id: string;
        company_name: string;
        created_at: string;
        rating: number;
        status: string;
        message: string;
        likes_count: number;
    }>;
}

/**
 * Global search across companies and comments
 * GET /api/search?q=search+term&limit=10
 */
export const globalSearch = async (
    searchTerm: string,
    limit: number = 10
): Promise<{
    companies: Company[];
    comments: Array<{
        id: string;
        authorId: string;
        authorName: string;
        companyId: string;
        companyName: string;
        date: Date;
        rating: number;
        status: string;
        message: string;
        likesCount: number;
    }>;
}> => {
    try {
        if (!searchTerm || searchTerm.trim().length < 1) {
            return { companies: [], comments: [] };
        }

        const params = new URLSearchParams();
        params.append('q', searchTerm.trim());
        params.append('limit', limit.toString());

        const response = await api.get<GlobalSearchResponse>(`/api/search?${params.toString()}`);

        return {
            companies: (response.companies || []).map(apiCompanyToCompany),
            comments: (response.comments || []).map(c => ({
                id: c.id,
                authorId: c.author_id,
                authorName: c.author_name || 'Anonim',
                companyId: c.company_id,
                companyName: c.company_name || '',
                date: new Date(c.created_at),
                rating: c.rating || 0,
                status: c.status || 'pending',
                message: c.message || '',
                likesCount: c.likes_count || 0,
            })),
        };
    } catch (error) {
        console.error('Error performing global search:', error);
        return { companies: [], comments: [] };
    }
};
