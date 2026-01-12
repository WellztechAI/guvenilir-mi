import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reward, RewardFirestore, rewardFromFirestore, rewardToFirestore } from '@/types';

const REWARDS_COLLECTION = 'rewards';

/**
 * Creates a new reward in Firestore
 */
export const createReward = async (
    userId: string,
    reward: Omit<Reward, 'id'>
): Promise<string> => {
    try {
        console.log('Creating reward for user:', userId);
        const userRewardsRef = collection(db, 'users', userId, REWARDS_COLLECTION);
        const firestoreReward = rewardToFirestore({ ...reward, id: '' });
        const { id: _, ...rewardData } = firestoreReward;

        const docRef = await addDoc(userRewardsRef, rewardData);
        console.log('Reward created successfully:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating reward:', error);
        throw error;
    }
};

/**
 * Fetches a single reward by ID
 */
export const fetchReward = async (userId: string, rewardId: string): Promise<Reward | null> => {
    try {
        const rewardRef = doc(db, 'users', userId, REWARDS_COLLECTION, rewardId);
        const rewardSnap = await getDoc(rewardRef);

        if (!rewardSnap.exists()) {
            console.log('No reward found with ID:', rewardId);
            return null;
        }

        const data = rewardSnap.data() as Omit<RewardFirestore, 'id'>;
        return rewardFromFirestore({ ...data, id: rewardSnap.id });
    } catch (error) {
        console.error('Error fetching reward:', error);
        throw error;
    }
};

/**
 * Fetches all rewards for a user
 * First tries to fetch from top-level rewards collection where doc ID = userId
 * Falls back to subcollection if not found
 */
export const fetchRewardsByUserId = async (userId: string): Promise<Reward[]> => {
    try {
        console.log('Fetching rewards for user:', userId);
        
        // First, try to fetch from top-level rewards collection where document ID is the userId
        try {
            const rewardDocRef = doc(db, REWARDS_COLLECTION, userId);
            const rewardDocSnap = await getDoc(rewardDocRef);
            
            if (rewardDocSnap.exists()) {
                console.log('Found rewards document at top level');
                const data = rewardDocSnap.data();
                
                // Check if the document contains an array of rewards or individual reward fields
                if (data.rewards && Array.isArray(data.rewards)) {
                    // If rewards are stored as an array in the document
                    return data.rewards.map((reward: RewardFirestore, index: number) => 
                        rewardFromFirestore({ ...reward, id: reward.id || `${userId}_${index}` })
                    );
                } else {
                    // If the document itself is a single reward
                    return [rewardFromFirestore({ ...data as RewardFirestore, id: rewardDocSnap.id })];
                }
            }
        } catch (topLevelError) {
            console.log('No rewards found at top level, trying subcollection:', topLevelError);
        }
        
        // Fallback: Try subcollection approach
        const rewardsRef = collection(db, 'users', userId, REWARDS_COLLECTION);
        const q = query(rewardsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        const rewards = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<RewardFirestore, 'id'>;
            return rewardFromFirestore({ ...data, id: doc.id });
        });
        
        console.log('Found rewards in subcollection:', rewards.length);
        return rewards;
    } catch (error) {
        console.error('Error fetching rewards:', error);
        throw error;
    }
};

/**
 * Fetches unused rewards for a user
 */
export const fetchUnusedRewards = async (userId: string): Promise<Reward[]> => {
    try {
        const rewardsRef = collection(db, 'users', userId, REWARDS_COLLECTION);
        const q = query(rewardsRef, where('isUsed', '==', false), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<RewardFirestore, 'id'>;
            return rewardFromFirestore({ ...data, id: doc.id });
        });
    } catch (error) {
        console.error('Error fetching unused rewards:', error);
        throw error;
    }
};

/**
 * Fetches used rewards for a user
 */
export const fetchUsedRewards = async (userId: string): Promise<Reward[]> => {
    try {
        const rewardsRef = collection(db, 'users', userId, REWARDS_COLLECTION);
        const q = query(rewardsRef, where('isUsed', '==', true), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<RewardFirestore, 'id'>;
            return rewardFromFirestore({ ...data, id: doc.id });
        });
    } catch (error) {
        console.error('Error fetching used rewards:', error);
        throw error;
    }
};

/**
 * Marks a reward as used
 */
export const markRewardAsUsed = async (userId: string, rewardId: string): Promise<void> => {
    try {
        const rewardRef = doc(db, 'users', userId, REWARDS_COLLECTION, rewardId);
        await updateDoc(rewardRef, { isUsed: true });
        console.log('Reward marked as used:', rewardId);
    } catch (error) {
        console.error('Error marking reward as used:', error);
        throw error;
    }
};

/**
 * Updates a reward
 */
export const updateReward = async (
    userId: string,
    rewardId: string,
    updates: Partial<Omit<Reward, 'id'>>
): Promise<void> => {
    try {
        const rewardRef = doc(db, 'users', userId, REWARDS_COLLECTION, rewardId);
        await updateDoc(rewardRef, updates);
        console.log('Reward updated:', rewardId);
    } catch (error) {
        console.error('Error updating reward:', error);
        throw error;
    }
};

/**
 * Deletes a reward
 */
export const deleteReward = async (userId: string, rewardId: string): Promise<void> => {
    try {
        const rewardRef = doc(db, 'users', userId, REWARDS_COLLECTION, rewardId);
        await deleteDoc(rewardRef);
        console.log('Reward deleted:', rewardId);
    } catch (error) {
        console.error('Error deleting reward:', error);
        throw error;
    }
};

/**
 * Validates a reward code
 */
export const validateRewardCode = async (userId: string, code: string): Promise<Reward | null> => {
    try {
        const rewardsRef = collection(db, 'users', userId, REWARDS_COLLECTION);
        const q = query(rewardsRef, where('code', '==', code), where('isUsed', '==', false));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('No valid reward found with code:', code);
            return null;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data() as Omit<RewardFirestore, 'id'>;
        return rewardFromFirestore({ ...data, id: doc.id });
    } catch (error) {
        console.error('Error validating reward code:', error);
        throw error;
    }
};
