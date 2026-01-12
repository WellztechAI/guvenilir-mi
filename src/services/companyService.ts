import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/types';

const COMPANIES_COLLECTION = 'companies';

/**
 * Creates a new company in Firestore
 */
export const createCompany = async (company: Omit<Company, 'id'>): Promise<string> => {
    try {
        console.log('Creating company:', company.name);
        const companiesRef = collection(db, COMPANIES_COLLECTION);
        const docRef = await addDoc(companiesRef, company);
        console.log('Company created successfully:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }
};

/**
 * Creates a company with a specific ID
 */
export const createCompanyWithId = async (id: string, company: Omit<Company, 'id'>): Promise<void> => {
    try {
        console.log('Creating company with ID:', id);
        const companyRef = doc(db, COMPANIES_COLLECTION, id);
        await setDoc(companyRef, company);
        console.log('Company created successfully with ID:', id);
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }
};

/**
 * Fetches a company by ID
 */
export const fetchCompany = async (companyId: string): Promise<Company | null> => {
    try {
        const companyRef = doc(db, COMPANIES_COLLECTION, companyId);
        const companySnap = await getDoc(companyRef);

        if (!companySnap.exists()) {
            console.log('No company found with ID:', companyId);
            return null;
        }

        return { ...companySnap.data(), id: companySnap.id } as Company;
    } catch (error) {
        console.error('Error fetching company:', error);
        throw error;
    }
};

/**
 * Fetches all companies
 */
export const fetchAllCompanies = async (): Promise<Company[]> => {
    try {
        const companiesRef = collection(db, COMPANIES_COLLECTION);
        const querySnapshot = await getDocs(companiesRef);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Company));
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

/**
 * Fetches companies by status
 */
export const fetchCompaniesByStatus = async (status: string): Promise<Company[]> => {
    try {
        const companiesRef = collection(db, COMPANIES_COLLECTION);
        const q = query(companiesRef, where('status', '==', status));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Company));
    } catch (error) {
        console.error('Error fetching companies by status:', error);
        throw error;
    }
};

/**
 * Fetches companies by sector
 */
export const fetchCompaniesBySector = async (sector: string): Promise<Company[]> => {
    try {
        const companiesRef = collection(db, COMPANIES_COLLECTION);
        const q = query(companiesRef, where('sectors', 'array-contains', sector));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Company));
    } catch (error) {
        console.error('Error fetching companies by sector:', error);
        throw error;
    }
};

/**
 * Fetches top-rated companies
 */
export const fetchTopRatedCompanies = async (limitCount: number = 10): Promise<Company[]> => {
    try {
        const companiesRef = collection(db, COMPANIES_COLLECTION);
        const q = query(
            companiesRef,
            where('status', '==', 'active'),
            orderBy('rating', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Company));
    } catch (error) {
        console.error('Error fetching top-rated companies:', error);
        throw error;
    }
};

/**
 * Searches companies by name
 */
export const searchCompaniesByName = async (searchTerm: string): Promise<Company[]> => {
    try {
        // Note: Firestore doesn't support native text search
        // For a production app, consider using Algolia or similar
        const companiesRef = collection(db, COMPANIES_COLLECTION);
        const querySnapshot = await getDocs(companiesRef);

        const searchLower = searchTerm.toLowerCase();
        return querySnapshot.docs
            .map(doc => ({
                ...doc.data(),
                id: doc.id,
            } as Company))
            .filter(company =>
                company.name.toLowerCase().includes(searchLower)
            );
    } catch (error) {
        console.error('Error searching companies:', error);
        throw error;
    }
};

/**
 * Updates a company
 */
export const updateCompany = async (
    companyId: string,
    updates: Partial<Omit<Company, 'id'>>
): Promise<void> => {
    try {
        const companyRef = doc(db, COMPANIES_COLLECTION, companyId);
        await updateDoc(companyRef, updates);
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
        const companyRef = doc(db, COMPANIES_COLLECTION, companyId);
        await updateDoc(companyRef, { rating: newRating });
        console.log('Company rating updated:', companyId, newRating);
    } catch (error) {
        console.error('Error updating company rating:', error);
        throw error;
    }
};

/**
 * Increments company comment count
 */
export const incrementCompanyCommentCount = async (companyId: string): Promise<void> => {
    try {
        const company = await fetchCompany(companyId);
        if (company) {
            const newCount = (company.commentCount || 0) + 1;
            await updateDoc(doc(db, COMPANIES_COLLECTION, companyId), { commentCount: newCount });
            console.log('Company comment count incremented:', companyId, newCount);
        }
    } catch (error) {
        console.error('Error incrementing comment count:', error);
        throw error;
    }
};

/**
 * Updates company status
 */
export const updateCompanyStatus = async (companyId: string, status: string): Promise<void> => {
    try {
        const companyRef = doc(db, COMPANIES_COLLECTION, companyId);
        await updateDoc(companyRef, { status });
        console.log('Company status updated:', companyId, status);
    } catch (error) {
        console.error('Error updating company status:', error);
        throw error;
    }
};

/**
 * Deletes a company
 */
export const deleteCompany = async (companyId: string): Promise<void> => {
    try {
        const companyRef = doc(db, COMPANIES_COLLECTION, companyId);
        await deleteDoc(companyRef);
        console.log('Company deleted:', companyId);
    } catch (error) {
        console.error('Error deleting company:', error);
        throw error;
    }
};

/**
 * Creates a company from an approved verification
 */
export const createCompanyFromVerification = async (
    verification: any,
    updateVerificationWithCompanyId: (verificationId: string, companyId: string) => Promise<void>
): Promise<string> => {
    try {
        console.log('Creating company from verification:', verification.id);
        
        const company: Omit<Company, 'id'> = {
            name: verification.requesterName,
            description: '',
            rating: null, // null instead of 0
            commentCount: 0,
            phone: verification.requesterPhoneNumber || '',
            sectors: [],
            status: 'active',
        };
        
        // Always create with auto-generated ID
        const companyId = await createCompany(company);
        console.log('Company created successfully:', companyId);
        
        // Save companyId to verification
        await updateVerificationWithCompanyId(verification.id, companyId);
        
        return companyId;
    } catch (error) {
        console.error('Error creating company from verification:', error);
        throw error;
    }
};

/**
 * Fetches multiple companies by their IDs
 */
export const fetchCompaniesByIds = async (companyIds: string[]): Promise<Company[]> => {
    try {
        if (companyIds.length === 0) {
            return [];
        }

        const companies: Company[] = [];
        
        // Fetch each company individually
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
        rating: 0,
        commentCount: 0,
        imageUrl: undefined,
        phone: '',
        sectors,
        status: 'pending',
    };
};
