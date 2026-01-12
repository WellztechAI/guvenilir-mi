import { doc, getDoc, setDoc, updateDoc, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CompanyVerification } from '@/types';

const COMPANY_VERIFICATION_COLLECTION = 'company_verifications';

/**
 * Firestore type for CompanyVerification (with Timestamp for dates)
 */
interface CompanyVerificationFirestore extends Omit<CompanyVerification, 'createdAt'> {
    createdAt: Timestamp;
}

/**
 * Creates a new company verification request in Firestore
 */
export const createCompanyVerification = async (
    verification: Omit<CompanyVerification, 'id' | 'createdAt'> & { createdAt?: Date }
): Promise<string> => {
    try {
        console.log('Attempting to create company verification in Firestore');

        const verificationData: Omit<CompanyVerificationFirestore, 'id'> = {
            ...verification,
            createdAt: Timestamp.fromDate(verification.createdAt || new Date()),
        };

        const docRef = await addDoc(collection(db, COMPANY_VERIFICATION_COLLECTION), verificationData);
        console.log('Company verification created successfully:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating company verification:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
    }
};

/**
 * Fetches a company verification by ID
 */
export const fetchCompanyVerification = async (id: string): Promise<CompanyVerification | null> => {
    try {
        const docRef = doc(db, COMPANY_VERIFICATION_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log('No company verification found with ID:', id);
            return null;
        }

        const data = docSnap.data() as CompanyVerificationFirestore;
        return {
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt.toDate(),
        };
    } catch (error) {
        console.error('Error fetching company verification:', error);
        throw error;
    }
};

/**
 * Fetches all company verifications for a specific company
 */
export const fetchCompanyVerificationsByCompanyId = async (companyId: string): Promise<CompanyVerification[]> => {
    try {
        const q = query(
            collection(db, COMPANY_VERIFICATION_COLLECTION),
            where('companyId', '==', companyId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data() as CompanyVerificationFirestore;
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt.toDate(),
            };
        });
    } catch (error) {
        console.error('Error fetching company verifications:', error);
        throw error;
    }
};

/**
 * Fetches a company verification by requester's company email
 * Used to fetch company data for authenticated company users
 */
export const fetchCompanyVerificationByEmail = async (email: string): Promise<CompanyVerification | null> => {
    try {
        const q = query(
            collection(db, COMPANY_VERIFICATION_COLLECTION),
            where('requesterCompanyEmail', '==', email)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('No company verification found for email:', email);
            return null;
        }

        // Return the first matching document
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data() as CompanyVerificationFirestore;
        return {
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt.toDate(),
        };
    } catch (error) {
        console.error('Error fetching company verification by email:', error);
        throw error;
    }
};

/**
 * Updates a company verification status
 */
export const updateCompanyVerificationStatus = async (
    id: string,
    status: string
): Promise<void> => {
    try {
        const docRef = doc(db, COMPANY_VERIFICATION_COLLECTION, id);
        await updateDoc(docRef, { status });
        console.log('Company verification status updated:', id, status);
    } catch (error) {
        console.error('Error updating company verification status:', error);
        throw error;
    }
};

/**
 * Updates a company verification
 */
export const updateCompanyVerification = async (
    id: string,
    updates: Partial<Omit<CompanyVerification, 'id' | 'createdAt'>>
): Promise<void> => {
    try {
        const docRef = doc(db, COMPANY_VERIFICATION_COLLECTION, id);
        await updateDoc(docRef, updates);
        console.log('Company verification updated:', id);
    } catch (error) {
        console.error('Error updating company verification:', error);
        throw error;
    }
};
