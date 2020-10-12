import * as firebaseTesting from '@firebase/testing';
import * as firebase from 'firebase';

export interface AuthedAppData {
  firestore: firebaseTesting.firestore.Firestore;
  functions: firebase.functions.Functions;
}

export async function authedApp(auth?: object): Promise<AuthedAppData> {
  // await firebaseTesting.clearFirestoreData({ projectId: 'f1-serverless'})
  const app = firebaseTesting.initializeTestApp({ projectId: 'f1-serverless', auth });
  const firestore: firebaseTesting.firestore.Firestore = app.firestore();
  const functions: firebase.functions.Functions = app.functions('europe-west1');
  functions.useFunctionsEmulator('http://localhost:5001');
  return Promise.resolve({ firestore, functions });
}

export function adminApp() {
  const firestore = firebaseTesting.initializeAdminApp({ projectId: 'f1-serverless' }).firestore();
  return firestore;
}

export function clearFirestoreData(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      return firebaseTesting.clearFirestoreData({
        projectId: 'f1-serverless'
      }).then(() => resolve());
    }, 2);
  },)
}

export const retry = <T>(promiseFn: () => Promise<T>, validatorFn?: (data: T) => boolean): Promise<T> => {
  return new Promise(resolve => {
    const intervalNo = setInterval(async () => {
      const t: T = await promiseFn();
      const fn = validatorFn || ((defaultData: T) => !!defaultData);
      if (fn(t)) {
        clearInterval(intervalNo);
        resolve(t);
      }
    }, 1000);
  });
}

export const shouldaFailed = () => fail('Should have resulted in an error, when bid is invalid');
export const failedPrecondition = (_: any) => expect(_.code).toEqual('failed-precondition');
export const notFound = (_: any) => expect(_.code).toEqual('not-found');
export const permissionDenied = (_: any) => expect(_.code).toEqual('permission-denied');
export const unauthenticated = (_: any) => expect(_.code).toEqual('unauthenticated');

