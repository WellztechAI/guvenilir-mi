import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserFirestore, userFromFirestore, userToFirestore } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Fetches a user by their UID from Firestore
 */
export const fetchUser = async (uid: string): Promise<User | null> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log('No user found with UID:', uid);
            return null;
        }

        const userData = userSnap.data() as UserFirestore;
        return userFromFirestore(userData);
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

/**
 * Creates a new user in Firestore
 */
export const createUser = async (user: User): Promise<void> => {
    try {
        console.log('Attempting to create user in Firestore:', user.id);
        const userRef = doc(db, USERS_COLLECTION, user.id);
        const firestoreUser = userToFirestore(user);
        console.log('User data to save:', firestoreUser);
        await setDoc(userRef, firestoreUser);
        console.log('User created successfully in Firestore:', user.id);
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
    }
};

/**
 * Updates an existing user in Firestore
 */
export const updateUser = async (uid: string, updates: Partial<User>): Promise<void> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);

        // Convert Date fields to Timestamp if present
        const firestoreUpdates: Record<string, unknown> = { ...updates };
        if (updates.createdAt) {
            firestoreUpdates.createdAt = Timestamp.fromDate(updates.createdAt);
        }

        await updateDoc(userRef, firestoreUpdates);
        console.log('User updated successfully:', uid);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

/**
 * Creates a new user object with default values
 */
export const createDefaultUser = (
    uid: string,
    email: string,
    displayName?: string | null,
    phoneNumber?: string | null
): User => {
    return {
        id: uid,
        userName: displayName || email.split('@')[0],
        email: email,
        phoneNumber: phoneNumber || undefined,
        favouriteCompanies: [],
        createdAt: new Date(),
        country: undefined,
        imageUrl: undefined,
        status: 'active',
    };
};

/**
 * Fetches user or creates a new one if doesn't exist
 */
export const fetchOrCreateUser = async (
    uid: string,
    email: string,
    displayName?: string | null,
    phoneNumber?: string | null
): Promise<User> => {
    let user = await fetchUser(uid);

    if (!user) {
        // Create new user
        user = createDefaultUser(uid, email, displayName, phoneNumber);
        await createUser(user);
    }

    return user;
};
