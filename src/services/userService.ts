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
        console.log('Firestore db instance:', db);

        if (!db) {
            throw new Error('Firestore database instance is not initialized');
        }

        const userRef = doc(db, USERS_COLLECTION, user.id);
        console.log('User ref created for collection:', USERS_COLLECTION);

        const firestoreUser = userToFirestore(user);
        console.log('User data to save:', JSON.stringify(firestoreUser, null, 2));

        await setDoc(userRef, firestoreUser);
        console.log('User created successfully in Firestore:', user.id);
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
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

export const fetchOrCreateUser = async (
    uid: string,
    email: string,
    displayName?: string | null,
    phoneNumber?: string | null
): Promise<User> => {
    let user = await fetchUser(uid);

    if (!user) {
        // Create new user
        console.log('User not found, creating new user:', uid);
        user = createDefaultUser(uid, email, displayName, phoneNumber);
        await createUser(user);
    } else {
        // User exists, check if we need to update any info to keep sync with Auth
        const updates: Partial<User> = {};
        let hasUpdates = false;

        // Update email if changed
        if (email && user.email !== email) {
            updates.email = email;
            hasUpdates = true;
        }

        // Update display name if changed and provided
        // Note: Firestore field is 'userName', Auth field is 'displayName'
        if (displayName && user.userName !== displayName) {
            updates.userName = displayName;
            hasUpdates = true;
        }

        // Update phone number if provided and different (or missing)
        if (phoneNumber && user.phoneNumber !== phoneNumber) {
            updates.phoneNumber = phoneNumber;
            hasUpdates = true;
        }

        if (hasUpdates) {
            console.log('Syncing user data from Auth/Store to Firestore:', updates);
            await updateUser(uid, updates);
            // Update local user object to return the most recent data
            user = { ...user, ...updates };
        }
    }

    return user;
};
