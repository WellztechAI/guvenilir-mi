import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Noti, NotiFirestore, notiFromFirestore, notiToFirestore } from '@/types';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Creates a new notification in Firestore
 */
export const createNotification = async (
    userId: string,
    notification: Omit<Noti, 'id'>
): Promise<string> => {
    try {
        console.log('Creating notification for user:', userId);
        const userNotisRef = collection(db, 'users', userId, NOTIFICATIONS_COLLECTION);
        const firestoreNoti = notiToFirestore({ ...notification, id: '' });
        const { id: _, ...notiData } = firestoreNoti;

        const docRef = await addDoc(userNotisRef, notiData);
        console.log('Notification created successfully:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

/**
 * Fetches a single notification by ID
 */
export const fetchNotification = async (userId: string, notificationId: string): Promise<Noti | null> => {
    try {
        const notiRef = doc(db, 'users', userId, NOTIFICATIONS_COLLECTION, notificationId);
        const notiSnap = await getDoc(notiRef);

        if (!notiSnap.exists()) {
            console.log('No notification found with ID:', notificationId);
            return null;
        }

        const data = notiSnap.data() as Omit<NotiFirestore, 'id'>;
        return notiFromFirestore({ ...data, id: notiSnap.id });
    } catch (error) {
        console.error('Error fetching notification:', error);
        throw error;
    }
};

/**
 * Fetches all notifications for a user
 */
export const fetchNotificationsByUserId = async (userId: string): Promise<Noti[]> => {
    try {
        const notisRef = collection(db, 'users', userId, NOTIFICATIONS_COLLECTION);
        const q = query(notisRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<NotiFirestore, 'id'>;
            return notiFromFirestore({ ...data, id: doc.id });
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

/**
 * Fetches unread notifications for a user
 */
export const fetchUnreadNotifications = async (userId: string): Promise<Noti[]> => {
    try {
        const notisRef = collection(db, 'users', userId, NOTIFICATIONS_COLLECTION);
        const q = query(notisRef, where('isRead', '==', false), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<NotiFirestore, 'id'>;
            return notiFromFirestore({ ...data, id: doc.id });
        });
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
    try {
        const notiRef = doc(db, 'users', userId, NOTIFICATIONS_COLLECTION, notificationId);
        await updateDoc(notiRef, { isRead: true });
        console.log('Notification marked as read:', notificationId);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

/**
 * Marks all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    try {
        const notifications = await fetchUnreadNotifications(userId);
        const updatePromises = notifications.map(noti =>
            markNotificationAsRead(userId, noti.id)
        );
        await Promise.all(updatePromises);
        console.log('All notifications marked as read for user:', userId);
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

/**
 * Updates a notification
 */
export const updateNotification = async (
    userId: string,
    notificationId: string,
    updates: Partial<Omit<Noti, 'id'>>
): Promise<void> => {
    try {
        const notiRef = doc(db, 'users', userId, NOTIFICATIONS_COLLECTION, notificationId);
        await updateDoc(notiRef, updates);
        console.log('Notification updated:', notificationId);
    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

/**
 * Deletes a notification
 */
export const deleteNotification = async (userId: string, notificationId: string): Promise<void> => {
    try {
        const notiRef = doc(db, 'users', userId, NOTIFICATIONS_COLLECTION, notificationId);
        await deleteDoc(notiRef);
        console.log('Notification deleted:', notificationId);
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};
