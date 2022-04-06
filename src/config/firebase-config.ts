import firebase from 'firebase'
import 'firebase/storage'
export const app = firebase.initializeApp({
    apiKey: "AIzaSyA-Le43juSg0_Ye706Bnvlnnf5PYgZGWKI",
    authDomain: "sushi-90e4b.firebaseapp.com",
    databaseURL: "https://sushi-90e4b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sushi-90e4b",
    storageBucket: "sushi-90e4b.appspot.com",
    messagingSenderId: "370848554915",
    appId: "1:370848554915:web:9125f4f7ade2a4721b4416"

    // apiKey: "AIzaSyDiGm7-RaT-Dn-CzUWzmFijr7YX9wH50Hs",
    // authDomain: "sushi-bar-87af9.firebaseapp.com",
    // databaseURL: "https://sushi-bar-87af9-default-rtdb.europe-west1.firebasedatabase.app",
    // projectId: "sushi-bar-87af9",
    // storageBucket: "sushi-bar-87af9.appspot.com",
    // messagingSenderId: "310480739817",
    // appId: "1:310480739817:web:8e9dc728409e67586d7f78"
});

export  {
    firebase as default
}