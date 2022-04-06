import {Observable, of} from 'rxjs';
import Axios from "axios-observable";
import AuthService, {UserData} from "./AuthService";
import {LoginData} from "../components/library/LoginForm";
import {ACCESS_TOKEN_KEY} from "../config/constants";
import {map} from "rxjs/operators";
function toUserData(url:string, email:string): Observable<UserData> {
    return Axios.get<string[]>(url + '/administrators')
        .pipe(map(response => {
            const res: UserData = {email: email, username: email,
                isAdmin: response.data.indexOf(email) >= 0};

            return res;
        }))
}
export default class AuthServiceRestJwt implements AuthService {
    constructor(private url:string) {
    }
    getUserData(): Observable<UserData> {
        const rowToken:string|null =
            localStorage.getItem(ACCESS_TOKEN_KEY);
        if(!rowToken) {
            return of({username:'', isAdmin:false, email: '', isDelivery:false});
        }
        const rowPayload = rowToken.split('.')[1];
        const payload = JSON.parse(atob(rowPayload));
        if (payload.exp < Date.now()/1000) {
            this.logout().then();
            return of({username:'', isAdmin:false, email: '', isDelivery:false});
        }
        return toUserData(this.url, payload.email);
    }

    login(loginData: LoginData): Promise<boolean> {
        return Axios.post(`${this.url}/login`,{
            email:loginData.username, password:loginData.password
        }).toPromise().then((res) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
            return true
        }).catch((error) => false);
    }

    logout(): Promise<boolean> {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return Promise.resolve(true);
    }

}
