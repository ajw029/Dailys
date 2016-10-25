import C from '../constants/configs';
console.log(C)
import * as firebase from 'firebase';

console.log(firebase)
firebase.initializeApp(C.firebaseConfig);
export const auth = firebase.auth();
export const database = firebase.database();
