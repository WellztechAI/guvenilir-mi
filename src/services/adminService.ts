import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CompanyVerification } from '@/types';
import { Timestamp } from 'firebase/firestore';

const COMPANY_VERIFICATION_COLLECTION = 'company_verifications';
const COMPANIES_COLLECTION = 'companies';

/**
 * Firestore type for CompanyVerification (with Timestamp for dates)
 */
interface CompanyVerificationFirestore extends Omit<CompanyVerification, 'createdAt'> {
    createdAt: Timestamp;
}

/**
 * Fetches all company verifications
 */
export const fetchAllCompanyVerifications = async (): Promise<CompanyVerification[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COMPANY_VERIFICATION_COLLECTION));

        return querySnapshot.docs.map(doc => {
            const data = doc.data() as CompanyVerificationFirestore;
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt.toDate(),
            };
        });
    } catch (error) {
        console.error('Error fetching all company verifications:', error);
        throw error;
    }
};

/**
 * Updates the status of a company verification
 * If approved, creates company in companies collection
 */
export const updateVerificationStatus = async (
    id: string,
    status: 'approved' | 'rejected' | 'pending'
): Promise<void> => {
    try {
        // Update verification status
        const docRef = doc(db, COMPANY_VERIFICATION_COLLECTION, id);
        await updateDoc(docRef, { status });
        console.log('✅ Status updated:', status);
        
        // Fetch verification data
        const verifications = await fetchAllCompanyVerifications();
        const verification = verifications.find(v => v.id === id);
        
        if (!verification) {
            console.log('Verification not found');
            return;
        }
        
        // If approved, create company (if not exists) or activate it
        if (status === 'approved') {
            if (verification.companyId) {
                // Company already exists, just activate it
                const companyRef = doc(db, COMPANIES_COLLECTION, verification.companyId);
                await updateDoc(companyRef, { status: 'active' });
                console.log('✅ Company activated:', verification.companyId);
            } else {
                // Create new company
                const companyData = {
                    name: verification.requesterName,
                    description: '',
                    rating: null,
                    commentCount: 0,
                    phone: verification.requesterPhoneNumber || '',
                    sectors: [],
                    status: 'active',
                };
                
                const companyRef = await addDoc(collection(db, COMPANIES_COLLECTION), companyData);
                console.log('✅ Company created:', companyRef.id);
                
                // Save companyId to verification
                await updateDoc(docRef, { companyId: companyRef.id });
                console.log('✅ CompanyId saved to verification');
            }
        }
        
        // If rejected, deactivate company
        if (status === 'rejected') {
            if (verification.companyId) {
                const companyRef = doc(db, COMPANIES_COLLECTION, verification.companyId);
                await updateDoc(companyRef, { status: 'deactive' });
                console.log('✅ Company deactivated:', verification.companyId);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
};
