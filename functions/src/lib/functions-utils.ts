import { https } from "firebase-functions";

export const getUid = (context: https.CallableContext): string => {
    if (!context.auth?.uid) {
        throw new https.HttpsError('unauthenticated', 'You are not logged in');
    }
    return context.auth.uid
};