import { DateTime } from 'luxon';
import * as admin from 'firebase-admin';
import { Transaction } from './model';
import { firestoreUtils } from './firestore-utils';

// export transaction = (transaction)

export const transferInTransaction = ({date, amount, message, from, to}: Transaction, transaction: admin.firestore.Transaction): admin.firestore.Transaction =>  {
  const db = admin.firestore();
  const transactions = db.collection('transactions');
  
  return transaction.create(transactions.doc(), firestoreUtils.convertDateTimes(<Transaction> {
    date: date || DateTime.local(),
    amount,
    message,
    from: from ?? null,
    to: to ?? null,
    involved: [from, to].filter(Boolean),
  }));
}

export const transfer = (bankTransaction: Transaction): Promise<void> => {
  const db = admin.firestore();
  return db.runTransaction(transaction => {
    transferInTransaction(bankTransaction, transaction);
    return Promise.resolve();
  });
}
