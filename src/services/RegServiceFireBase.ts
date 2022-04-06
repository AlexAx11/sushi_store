import RegService, {RegData} from "./RegService";
import appFirebase from "../config/firebase-config";
import firebase from "firebase";
const actionCodeSettings = {
    url: 'https://sushi-90e4b.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
    handleCodeInApp: true,
    dynamicLinkDomain: 'example.page.link'
};

export default class RegServiceFireBase implements RegService {

    registration(regData: RegData): Promise<boolean> {
        return appFirebase.auth().createUserWithEmailAndPassword(regData.email, regData.password).
        then(() => true).catch((error) => false);
    }

    // async  registration(regData: RegData): Promise<boolean> {
    //
    //     try {
    //         const newUserCredential: firebase.auth.UserCredential=
    //             await appFirebase.auth()
    //                 .createUserWithEmailAndPassword(regData.email,regData.password);
    //         await newUserCredential.user?.sendEmailVerification();
    //         return true;
    //     }catch (error) {
    //         return false;
    //     }
    //
    // }
}