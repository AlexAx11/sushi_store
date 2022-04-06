import firebase from 'firebase'
import 'firebase/storage'
export const app = firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
});

export  {
    firebase as default
}