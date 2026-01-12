import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Company, Comment, CommentFirestore, commentFromFirestore } from '@/types';

const COMMENTS_COLLECTION = 'comments';

export const createComment = async (
    user: User,
    company: Company,
    rating: number,
    message: string,
    productName: string,
    contactMethod: string
): Promise<string> => {
    try {
        const commentData = {
            authorId: user.id,
            authorName: user.userName,
            authorAvatar: user.imageUrl || null,
            companyId: company.id,
            companyName: company.name,
            date: Timestamp.fromDate(new Date()),
            rating,
            status: 'pending',
            message,
            likesCount: 0,
            productName,
            contactMethod,
            answer: null,
            answerDate: null
        };

        const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);
        console.log('Comment created successfully with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

/**
 * Fetches comments by author ID
 */
export const fetchCommentsByAuthorId = async (authorId: string): Promise<Comment[]> => {
    try {
        const commentsRef = collection(db, COMMENTS_COLLECTION);
        const q = query(
            commentsRef,
            where('authorId', '==', authorId)
        );
        const querySnapshot = await getDocs(q);

        const comments = querySnapshot.docs.map(doc => {
            const data = doc.data() as CommentFirestore;
            return {
                ...commentFromFirestore(data),
                id: doc.id,
            };
        });

        // Sort by date descending (client-side to avoid index requirement)
        return comments.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
        console.error('Error fetching comments by author ID:', error);
        throw error;
    }
};

/**
 * Fetches comments by company ID
 */
export const fetchCommentsByCompanyId = async (companyId: string): Promise<Comment[]> => {
    try {
        const commentsRef = collection(db, COMMENTS_COLLECTION);
        const q = query(
            commentsRef,
            where('companyId', '==', companyId)
        );
        const querySnapshot = await getDocs(q);

        const comments = querySnapshot.docs.map(doc => {
            const data = doc.data() as CommentFirestore;
            return {
                ...commentFromFirestore(data),
                id: doc.id,
            };
        });

        // Client-side sort by date descending
        return comments.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
        console.error('Error fetching comments by company ID:', error);
        throw error;
    }
};
