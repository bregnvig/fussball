import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { internalError, validateAccess } from "../../lib";
import { Transaction } from "../../lib/model";

interface MigrationData {
  uid: string;
  playerName: string;
}

export const migrateAccount = functions.region('europe-west1').https.onCall(async (data: MigrationData, context) => {
  
  return validateAccess(context.auth?.uid, 'bank-admin')
  .then(() => migrate(data))
  .then(() => true)
  .catch(internalError);
});

const migrate = async ({ uid, playerName }: MigrationData) => {
  const db = admin.firestore();
  
  const transactions = await db.collection('transactions').where('involved', 'array-contains', playerName).get();
  
  console.log(`Found ${transactions.size} to be migrated from ${playerName} to ${uid}`);
  
  const chuncks = (Array.from({ length: (transactions.size / 500) + 1 }, (_, index) => index)
  .map(index => transactions.docs.slice(index * 500, (index + 1) * 500))
  );
  
  return Promise.all(chuncks.map(chunck => {
    return db.runTransaction(transaction => {
      chunck.forEach(docKey => transaction.update(docKey.ref, migratedTransaction(docKey.data() as Transaction, uid, playerName)));
      return Promise.resolve(chunck.length);
    });
  })).then(() => transactions.size)
}

const migratedTransaction = (transaction: Transaction, uid: string, playerName: string): Partial<Transaction> => {
  return {
    from: transaction.from === playerName ? uid : transaction.from || null,
    to: transaction.to === playerName ? uid : transaction.to || null,
    involved: transaction.involved.map(i => i === playerName ? uid : i)
  }
}