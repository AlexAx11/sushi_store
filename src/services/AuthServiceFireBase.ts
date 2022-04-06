import AuthService, {UserData} from "./AuthService";
import {Observable, of} from "rxjs";
import {LoginData} from "../components/library/LoginForm";
import {authState} from 'rxfire/auth'
import {docData} from 'rxfire/firestore';
import appFirebase from "../config/firebase-config";
import firebase from "firebase";
import {mergeMap, map} from "rxjs/operators";
import {FACEBOOK, GOOGLE, TWITTER} from "../config/constants";
export default class AuthServiceFirebase implements AuthService {
    getUserData(): Observable<UserData> {
        return authState(appFirebase.auth())
            .pipe(mergeMap<firebase.User, Observable<UserData>>(user => {
                if (!!user) {
                   return user.email ?
                       docData(appFirebase.firestore().collection('administrators')
                           .doc(user.email as string))
                           .pipe(map((doc: any) => ({email: user.email as string ,username: user.uid, isAdmin: !!doc && !!doc.uid }))) :
                       of({email: user.email as string, username: user.uid, isAdmin: false})
                }
                return of({email: '', username: '', isAdmin: false});
            }))
    }

    login(loginData: LoginData): Promise<boolean> {
        if(loginData.password === "") {
            if(loginData.username===GOOGLE) {
                let provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().languageCode = 'en';
                return appFirebase.auth().signInWithPopup(provider).then(() => true).catch((error) => false);
            } else if(loginData.username===FACEBOOK) {

            } else if(loginData.username===TWITTER) {

            }
        }
        return appFirebase.auth()
            .signInWithEmailAndPassword(loginData.username, loginData.password)
            .then(() => true).catch((error) => false);
    }


    logout(): Promise<boolean> {
        return appFirebase.auth().signOut().then(() => true).catch((error) => false);
    }
}
