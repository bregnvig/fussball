import * as admin from 'firebase-admin';

export const sendMessage = (tokens: string[], title: string, body: string, data?: { [key: string]: string; }): Promise<void> => {
  return admin.messaging().sendMulticast({
    data,
    tokens,
    notification: {
      title,
      body,
    },
    webpush: {
      notification: {
        badge: 'https://f2020.bregnvig.dk/assets/messaging/badge.v2.png',
        icon: 'https://f2020.bregnvig.dk/assets/icons/icon-192x192.png'
      }
    }
  }).then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  }).catch((error) => {
    console.log('Error sending message:', error);
  })
} 
