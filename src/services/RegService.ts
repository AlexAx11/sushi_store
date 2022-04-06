import firebase from "firebase";

export type RegData = {
    email: string;
    password: string;
}

export default interface RegService {
    registration(regData: RegData): Promise<boolean>;
}
